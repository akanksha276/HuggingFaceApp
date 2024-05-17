
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__)
CORS(app)

# Initialize the translation pipeline
translation_pipeline = pipeline("translation_en_to_fr")

# Initialize the model for summarization
checkpoint = "google-t5/t5-small"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint)

# Intialize the QA pipeline
question_answerer = pipeline("question-answering")


@app.route('/get-data', methods=['GET'])
def get_data():
    return jsonify({"message": "Welcome to the translation API!"}), 200

@app.route('/post-data', methods=['POST'])
def post_data():
    if request.is_json:
        data = request.get_json()
        text_to_translate = data.get("text", "")
        
        if not text_to_translate:
            return jsonify({"message": "No text provided for translation"}), 400
        
        translated_text = translation_pipeline(text_to_translate)
        return jsonify({"translated_text": translated_text[0]['translation_text']}), 201
    else:
        return jsonify({"message": "Request must be JSON"}), 400


@app.route('/summarize', methods=['POST'])
def summarize_text():
    # Get the input text from the request
    input_text = request.json['text']
    # Tokenize the input text and generate the summary
    inputs = tokenizer(input_text, return_tensors="pt", max_length=1024, truncation=True)
    outputs = model.generate(inputs.input_ids, max_length=150, num_beams=2, early_stopping=True)
    summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Return the summary as JSON response
    return jsonify({'summary': summary})

@app.route('/answer', methods=['POST'])
def get_answer():
    # Get the JSON data from the request
    data = request.get_json()
    # Extract the question and context from the JSON data
    question = data['question']
    context = data['context']
    # Use the question answering pipeline to get the answer
    answer = question_answerer(question=question, context=context)
    # Return the answer as JSON response
    return jsonify(answer)


if __name__ == '__main__':
    app.run(debug=True)
