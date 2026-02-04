# Run this in Google Colab to convert your model
# ================================================
# 
# 1. Upload your crnn_gtzan_model_best.h5 to Colab
# 2. Run this code
# 3. Download the output folder
# 4. Place in public/model/crnn_gtzan_genre_model_tfjs/

!pip install tensorflowjs

import tensorflowjs as tfjs
import tensorflow as tf

# Load your model
model = tf.keras.models.load_model('crnn_gtzan_model_best.h5')

# Print model info
print("Model Summary:")
model.summary()
print(f"\nInput shape: {model.input_shape}")
print(f"Output shape: {model.output_shape}")

# Convert to TensorFlow.js format
tfjs.converters.save_keras_model(model, 'crnn_gtzan_genre_model_tfjs')

print("\n✅ Conversion complete!")
print("Download the 'crnn_gtzan_genre_model_tfjs' folder and place it in:")
print("  public/model/crnn_gtzan_genre_model_tfjs/")

# Zip for easy download
!zip -r crnn_gtzan_genre_model_tfjs.zip crnn_gtzan_genre_model_tfjs

from google.colab import files
files.download('crnn_gtzan_genre_model_tfjs.zip')
