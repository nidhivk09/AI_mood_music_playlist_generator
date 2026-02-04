"""
Script to clean the model.json file for better TensorFlow.js compatibility.
This removes complex DTypePolicy objects that can cause loading issues.
Also fixes Keras 3.x to TensorFlow.js compatibility issues.
"""

import json
import os

MODEL_JSON_PATH = "public/model/crnn_gtzan_genre_model_tfjs/model.json"

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

def fix_input_layer(obj):
    """
    Fix InputLayer config for TensorFlow.js compatibility.
    Keras 3.x uses 'batch_shape', but TensorFlow.js expects 'batchInputShape'.
    """
    if isinstance(obj, dict):
        # Fix InputLayer config
        if obj.get('class_name') == 'InputLayer' and 'config' in obj:
            config = obj['config']
            # Convert batch_shape to batchInputShape
            if 'batch_shape' in config and 'batchInputShape' not in config:
                config['batchInputShape'] = config.pop('batch_shape')
            # Also handle batch_input_shape (snake_case variant)
            if 'batch_input_shape' in config and 'batchInputShape' not in config:
                config['batchInputShape'] = config.pop('batch_input_shape')
        
        # Recursively process all dict values
        return {k: fix_input_layer(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [fix_input_layer(item) for item in obj]
    else:
        return obj

def extract_keras_history(tensor_config):
    """Extract keras_history from a __keras_tensor__ config."""
    if isinstance(tensor_config, dict):
        if tensor_config.get('class_name') == '__keras_tensor__':
            config = tensor_config.get('config', {})
            keras_history = config.get('keras_history', [])
            if keras_history:
                return keras_history
    return None

def convert_inbound_nodes(inbound_nodes):
    """
    Convert Keras 3.x inbound_nodes format to Keras 2.x format.
    
    Keras 3.x format:
    [{"args": [{"class_name": "__keras_tensor__", "config": {"keras_history": ["layer_name", 0, 0]}}], "kwargs": {...}}]
    
    Keras 2.x format (expected by TensorFlow.js):
    [[["layer_name", 0, 0]]]
    """
    if not inbound_nodes:
        return inbound_nodes
    
    converted_nodes = []
    
    for node in inbound_nodes:
        if isinstance(node, dict) and 'args' in node:
            # Keras 3.x format
            args = node.get('args', [])
            node_data = []
            
            for arg in args:
                if isinstance(arg, list):
                    # Handle list of tensors (like Attention layer with multiple inputs)
                    for tensor in arg:
                        history = extract_keras_history(tensor)
                        if history:
                            node_data.append(history)
                else:
                    # Single tensor
                    history = extract_keras_history(arg)
                    if history:
                        node_data.append(history)
            
            if node_data:
                converted_nodes.append(node_data)
        elif isinstance(node, list):
            # Already in Keras 2.x format
            converted_nodes.append(node)
    
    return converted_nodes if converted_nodes else inbound_nodes

def fix_inbound_nodes(obj):
    """
    Recursively fix inbound_nodes in all layers.
    """
    if isinstance(obj, dict):
        # Fix inbound_nodes if present
        if 'inbound_nodes' in obj and obj['inbound_nodes']:
            obj['inbound_nodes'] = convert_inbound_nodes(obj['inbound_nodes'])
        
        # Recursively process all dict values
        return {k: fix_inbound_nodes(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [fix_inbound_nodes(item) for item in obj]
    else:
        return obj

def fix_lstm_weight_names(weights_manifest):
    """
    Fix LSTM weight names for TensorFlow.js compatibility.
    
    Keras 3.x uses: bidirectional/forward_lstm/lstm_cell/kernel
    TensorFlow.js expects: bidirectional/forward_lstm/kernel
    """
    if not weights_manifest:
        return weights_manifest
    
    for group in weights_manifest:
        if 'weights' in group:
            for weight in group['weights']:
                if 'name' in weight:
                    # Fix LSTM cell weight names
                    old_name = weight['name']
                    new_name = old_name.replace('/lstm_cell/', '/')
                    if old_name != new_name:
                        print(f"   Renaming weight: {old_name} → {new_name}")
                        weight['name'] = new_name
    
    return weights_manifest

def main():
    print("=" * 60)
    print("Model JSON Cleaner for TensorFlow.js Compatibility")
    print("=" * 60)
    
    if not os.path.exists(MODEL_JSON_PATH):
        print(f"❌ Error: model.json not found at {MODEL_JSON_PATH}")
        return False
    
    print(f"📂 Loading: {MODEL_JSON_PATH}")
    
    with open(MODEL_JSON_PATH, 'r') as f:
        model_json = json.load(f)
    
    # Count issues before cleaning
    json_str_before = json.dumps(model_json)
    dtype_count_before = json_str_before.count('DTypePolicy')
    batch_shape_count = json_str_before.count('"batch_shape"')
    keras_tensor_count = json_str_before.count('__keras_tensor__')
    lstm_cell_count = json_str_before.count('/lstm_cell/')
    
    print(f"📊 DTypePolicy entries found: {dtype_count_before}")
    print(f"📊 batch_shape entries found: {batch_shape_count}")
    print(f"📊 __keras_tensor__ entries found: {keras_tensor_count}")
    print(f"📊 /lstm_cell/ weight names found: {lstm_cell_count}")
    
    # Apply all fixes to the model topology
    if 'modelTopology' in model_json:
        print("\n🔧 Applying topology fixes...")
        model_json['modelTopology'] = clean_dtype_policy(model_json['modelTopology'])
        print("   ✓ Cleaned DTypePolicy")
        model_json['modelTopology'] = fix_input_layer(model_json['modelTopology'])
        print("   ✓ Fixed InputLayer batch_shape")
        model_json['modelTopology'] = fix_inbound_nodes(model_json['modelTopology'])
        print("   ✓ Converted inbound_nodes format")
    
    # Fix weight names in the manifest
    if 'weightsManifest' in model_json:
        print("\n🔧 Fixing weight names...")
        model_json['weightsManifest'] = fix_lstm_weight_names(model_json['weightsManifest'])
        print("   ✓ Fixed LSTM weight names")
    
    # Verify cleaning
    json_str_after = json.dumps(model_json)
    dtype_count_after = json_str_after.count('DTypePolicy')
    keras_tensor_count_after = json_str_after.count('__keras_tensor__')
    batch_input_shape_count = json_str_after.count('batchInputShape')
    lstm_cell_count_after = json_str_after.count('/lstm_cell/')
    
    # Write back
    with open(MODEL_JSON_PATH, 'w') as f:
        json.dump(model_json, f)
    
    print(f"\n✅ Results:")
    print(f"   DTypePolicy entries: {dtype_count_before} → {dtype_count_after}")
    print(f"   __keras_tensor__ entries: {keras_tensor_count} → {keras_tensor_count_after}")
    print(f"   /lstm_cell/ weight names: {lstm_cell_count} → {lstm_cell_count_after}")
    print(f"   batchInputShape entries: {batch_input_shape_count}")
    print(f"📁 File size: {os.path.getsize(MODEL_JSON_PATH):,} bytes")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    main()
