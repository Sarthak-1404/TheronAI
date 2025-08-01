import json
import re
from difflib import get_close_matches
from typing import Dict, List, Optional, Tuple

class MedicalChatbot:
    def __init__(self):
        """Initialize the chatbot with all necessary data sources."""
        self.diseases_data = self.load_json_data('data.json')
        self.policy_data = self.load_json_data('insurance_policies.json')
        self.conversation_data = self.load_json_data('conversation_data.json')
        
    def load_json_data(self, filename: str) -> List[Dict]:
        """Load JSON data from file."""
        try:
            with open(filename, 'r', encoding='utf-8') as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Warning: {filename} not found")
            return []
        except json.JSONDecodeError:
            print(f"Warning: Error parsing {filename}")
            return []
    
    def find_policy_match(self, user_input: str) -> Optional[Dict]:
        """Find matching policy information from the new JSON structure."""
        user_input_lower = user_input.lower()
        
        # Skip policy matching for clear disease/medical terms
        medical_disease_terms = ['asthma', 'diabetes', 'cancer', 'heart', 'lung', 'kidney', 'liver', 'brain', 'blood', 'infection', 'fever', 'pain', 'headache', 'cough', 'fever', 'vomiting', 'diarrhea', 'constipation', 'rash', 'allergy', 'arthritis', 'hypertension', 'depression', 'anxiety', 'migraine', 'epilepsy', 'stroke', 'pneumonia', 'tuberculosis', 'hepatitis', 'hiv', 'aids']
        
        # If input contains clear disease terms, skip policy matching
        if any(term in user_input_lower for term in medical_disease_terms):
            return None
        
        # Search through all policy topics
        for policy in self.policy_data:
            # Check keywords
            if 'keywords' in policy:
                for keyword in policy['keywords']:
                    if keyword.lower() in user_input_lower:
                        return policy
            
            # Check topic
            if 'topic' in policy and policy['topic'].lower() in user_input_lower:
                return policy
            
            # Check question
            if 'question' in policy:
                question_lower = policy['question'].lower()
                if any(word in user_input_lower for word in question_lower.split()):
                    return policy
        
        return None
    
    def find_best_match(self, user_input: str, data_list: List[Dict], key_field: str) -> Optional[Dict]:
        """Find the best matching item in a list of dictionaries."""
        user_input_lower = user_input.lower()
        
        # Common misspellings and variations
        variations = {
            'asthma': ['asthma', 'asthmatic', 'asthme'],
            'diabetes': ['diabetes', 'diabetic', 'diabetis'],
            'hypertension': ['hypertension', 'high blood pressure', 'htn'],
            'diarrhea': ['diarrhea', 'diarrhoea', 'loose stools'],
            'headache': ['headache', 'head pain', 'migraine'],
            'fever': ['fever', 'temperature', 'pyrexia'],
            'cough': ['cough', 'coughing', 'dry cough'],
            'chest pain': ['chest pain', 'chest discomfort', 'angina'],
            'back pain': ['back pain', 'backache', 'lumbar pain'],
            'joint pain': ['joint pain', 'arthritis', 'arthralgia']
        }
        
        # Expand user input with variations
        expanded_input = user_input_lower
        for correct, variants in variations.items():
            if any(variant in user_input_lower for variant in variants):
                expanded_input += ' ' + ' '.join(variants)
        
        # Remove common words that don't help with matching
        common_words = ['tell', 'me', 'about', 'what', 'is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
        search_words = [word for word in expanded_input.split() if word not in common_words]
        
        # Skip if no meaningful search words
        if not search_words:
            return None
        
        # Direct exact matches
        for item in data_list:
            if key_field in item:
                item_value = str(item[key_field]).lower()
                if user_input_lower in item_value or item_value in user_input_lower:
                    return item
        
        # Partial word matches (more flexible) - but only for disease names
        for item in data_list:
            if key_field in item:
                item_value = str(item[key_field]).lower()
                # Check if any search word is in the disease name
                for word in search_words:
                    if word in item_value and len(word) > 2:  # Only match words longer than 2 characters
                        return item
        
        # Fuzzy matching for close matches
        all_values = [str(item.get(key_field, '')).lower() for item in data_list if key_field in item]
        matches = get_close_matches(user_input_lower, all_values, n=1, cutoff=0.6)
        
        if matches:
            for item in data_list:
                if key_field in item and str(item[key_field]).lower() == matches[0]:
                    return item
        
        return None
    
    def find_conversation_match(self, user_input: str) -> Optional[Dict]:
        """Find matching conversation response."""
        user_input_lower = user_input.lower()
        
        # Skip conversation matching for medical terms
        medical_terms = ['disease', 'symptom', 'treatment', 'medicine', 'doctor', 'hospital', 'pain', 'fever', 'headache', 'cough', 'diabetes', 'asthma', 'cancer', 'heart', 'blood', 'infection', 'allergy', 'dental', 'mental', 'pregnancy', 'maternity', 'insurance', 'policy', 'claim', 'coverage']
        
        # If input contains medical terms, skip conversation matching
        if any(term in user_input_lower for term in medical_terms):
            return None
        
        # Direct exact matches
        for item in self.conversation_data:
            if 'input' in item:
                item_input = item['input'].lower()
                if user_input_lower == item_input:
                    return item
        
        # Partial matches for greetings and common phrases
        for item in self.conversation_data:
            if 'input' in item:
                item_input = item['input'].lower()
                if any(word in user_input_lower for word in item_input.split()):
                    return item
        
        return None
    
    def format_disease_response(self, disease: Dict) -> str:
        """Format disease information into a readable response."""
        response = f"🏥 **{disease.get('Disease', 'Unknown')}**\n\n"
        
        if 'Explanation' in disease and disease['Explanation'] != 'N/A':
            response += f"**What it is:** {disease['Explanation']}\n\n"
        
        if 'Causes' in disease and disease['Causes'] != 'N/A':
            response += f"**Causes:** {disease['Causes']}\n\n"
        
        if 'Symptoms' in disease and disease['Symptoms'] != 'N/A':
            response += f"**Symptoms:** {disease['Symptoms']}\n\n"
        
        if 'Treatment' in disease and disease['Treatment'] != 'N/A':
            response += f"**Treatment:** {disease['Treatment']}\n\n"
        
        if 'Medicines' in disease and disease['Medicines'] != 'N/A':
            response += f"**Medicines:** {disease['Medicines']}\n\n"
        
        if 'Suggestion' in disease and disease['Suggestion'] != 'N/A':
            response += f"**Suggestion:** {disease['Suggestion']}\n\n"
        
        if 'IsTestOrDoctorRequired' in disease:
            requirement = disease['IsTestOrDoctorRequired']
            if requirement == 'Yes':
                response += "⚠️ **Medical attention required**\n"
            elif requirement == 'Sometimes':
                response += "⚠️ **May require medical attention**\n"
            elif requirement == 'No':
                response += "✅ **Self-care usually sufficient**\n"
        
        if 'Tests' in disease and isinstance(disease['Tests'], dict):
            tests = disease['Tests']
            if 'Name' in tests:
                response += f"**Tests:** {tests['Name']}\n"
            if 'ApproximateCostINR' in tests:
                response += f"**Estimated Cost:** ₹{tests['ApproximateCostINR']}\n\n"
        
        return response
    
    def get_response(self, user_input: str) -> str:
        """Generate response based on user input."""
        user_input = user_input.strip()
        
        if not user_input:
            return "Please type your question or concern, and I'll be happy to help!"
        
        # Check for conversation/greeting patterns first (but skip for medical terms)
        conversation_match = self.find_conversation_match(user_input)
        if conversation_match:
            return conversation_match['response']
        
        # Check for disease/condition queries FIRST (before insurance)
        disease_match = self.find_best_match(user_input, self.diseases_data, 'Disease')
        if disease_match:
            return self.format_disease_response(disease_match)
        
        # Check for symptoms in disease descriptions
        for disease in self.diseases_data:
            if 'Symptoms' in disease and disease['Symptoms'] != 'N/A':
                symptoms = disease['Symptoms']
                if isinstance(symptoms, str):
                    symptoms = [symptoms]
                elif isinstance(symptoms, list):
                    symptoms = symptoms
            else:
                continue
                
            for symptom in symptoms:
                if symptom.lower() in user_input.lower():
                    return self.format_disease_response(disease)
        
        # Check for partial matches in disease names
        for disease in self.diseases_data:
            if 'Disease' in disease:
                disease_name = disease['Disease'].lower()
                if any(word in disease_name for word in user_input.lower().split()):
                    return self.format_disease_response(disease)
        
        # Check for policy/insurance queries LAST (only if no disease found)
        policy_match = self.find_policy_match(user_input)
        if policy_match:
            return f"📋 **Health Insurance Information:**\n\n**{policy_match['question']}**\n\n{policy_match['answer']}\n\n💡 *This is general information. For specific policy details, please contact your insurance provider.*"
        
        # If no specific match found, provide helpful guidance
        return self.get_helpful_response(user_input)
    
    def get_helpful_response(self, user_input: str) -> str:
        """Provide helpful response when no specific match is found."""
        response = "I couldn't find specific information about that. Here's how I can help you:\n\n"
        response += "🔍 **Try asking about:**\n"
        response += "• Specific diseases or conditions (e.g., 'diabetes', 'asthma')\n"
        response += "• Symptoms you're experiencing (e.g., 'headache', 'fever')\n"
        response += "• Health insurance topics (e.g., 'coverage', 'claims')\n"
        response += "• General health questions\n\n"
        response += "💡 **Examples:**\n"
        response += "• 'Tell me about diabetes'\n"
        response += "• 'What causes chest pain?'\n"
        response += "• 'Insurance coverage for maternity'\n"
        response += "• 'Hello' or 'Help'\n\n"
        response += "What would you like to know more about?"
        
        return response

# Example usage
if __name__ == "__main__":
    chatbot = MedicalChatbot()
    
    print("🏥 Medical Assistant Chatbot")
    print("Type 'quit' to exit\n")
    
    while True:
        user_input = input("You: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Chatbot: Goodbye! Take care of your health!")
            break
        
        response = chatbot.get_response(user_input)
        print(f"Chatbot: {response}\n")
