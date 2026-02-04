"""
Convert Keras H5 model to TensorFlow.js format

Usage:
    python convert_model.py

Requirements:
    pip install tensorflowjs tensorflow

This script converts the CRNN GTZAN model from .h5 format to TensorFlow.js
format for use in the browser.
"""

import os
import sys
import json
import re

try:
    import tensorflowjs as tfjs
    import tensorflow as tf
except ImportError:
    print("Please install required packages:")
    print("  pip install tensorflowjs tensorflow")
    sys.exit(1)

# Paths
INPUT_MODEL_PATH = "model/crnn_gtzan_model_best.h5"
OUTPUT_DIR = "public/model/crnn_gtzan_genre_model_tfjs"

def clean_model_json(model_json_path):
    """
    Clean up the model.json to be more compatible with TensorFlow.js.
    Removes complex DTypePolicy objects that can cause loading issues.
    """
    print("\n🔧 Cleaning model.json for better TensorFlow.js compatibility...")
    
    with open(model_json_path, 'r') as f:
        model_json = json.load(f)
    
    def clean_dtype_policy(obj):
        """Recursively clean DTypePolicy objects from the config."""
        if isinstance(obj, dict):
            # If this is a DTypePolicy config, simplify it
            if obj.get('class_name') == 'DTypePolicy':
                return 'float32'
            
            # Handle dtype that contains a DTypePolicy object
            if 'dtype' in obj and isinstance(obj['dtype'], dict):
                if obj['dtype'].get('class_name') == 'DTypePolicy':
                    obj['dtype'] = 'float32'
            
            # Recursively process all dict values
            return {k: clean_dtype_policy(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_dtype_policy(item) for item in obj]
        else:
            return obj
    
    # Clean the model topology
    if 'modelTopology' in model_json:
        model_json['modelTopology'] = clean_dtype_policy(model_json['modelTopology'])
    
    # Write back
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f)
    
    print("✅ model.json cleaned successfully")

def convert_model():
    print("=" * 60)
    print("GTZAN CRNN Model Converter")
    print("=" * 60)
    
    # Check if input model exists
    if not os.path.exists(INPUT_MODEL_PATH):
        print(f"❌ Error: Model not found at {INPUT_MODEL_PATH}")
        print("   Please ensure the model file is in the correct location.")
        return False
    
    print(f"📂 Input model: {INPUT_MODEL_PATH}")
    print(f"📂 Output directory: {OUTPUT_DIR}")
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load the Keras model
    print("\n🔄 Loading Keras model...")
    try:
        model = tf.keras.models.load_model(INPUT_MODEL_PATH)
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False
    
    # Print model summary
    print("\n📊 Model Summary:")
    model.summary()
    
    # Get input/output shapes
    input_shape = model.input_shape
    output_shape = model.output_shape
    print(f"\n📐 Input shape: {input_shape}")
    print(f"📐 Output shape: {output_shape}")
    
    # Convert to TensorFlow.js format
    print("\n🔄 Converting to TensorFlow.js format...")
    try:
        tfjs.converters.save_keras_model(model, OUTPUT_DIR)
        print("✅ Conversion successful!")
    except Exception as e:
        print(f"❌ Error during conversion: {e}")
        return False
    
    # Clean the model.json for better compatibility
    model_json_path = os.path.join(OUTPUT_DIR, "model.json")
    try:
        clean_model_json(model_json_path)
    except Exception as e:
        print(f"⚠️ Warning: Could not clean model.json: {e}")
    
    # List generated files
    print("\n📁 Generated files:")
    for f in os.listdir(OUTPUT_DIR):
        filepath = os.path.join(OUTPUT_DIR, f)
        size = os.path.getsize(filepath)
        print(f"   - {f} ({size:,} bytes)")
    
    print("\n" + "=" * 60)
    print("✅ Model conversion complete!")
    print("=" * 60)
    print(f"\nThe model is now available at: {OUTPUT_DIR}")
    print("You can load it in TensorFlow.js with:")
    print("  const model = await tf.loadLayersModel('/model/crnn_gtzan_genre_model_tfjs/model.json');")
    
    return True

if __name__ == "__main__":
    success = convert_model()
    sys.exit(0 if success else 1)
