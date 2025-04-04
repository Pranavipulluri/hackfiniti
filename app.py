import streamlit as st
import together
import json
from datetime import datetime

# Set your Together AI API key
together.api_key = "b849b5b18e1a70513df659b903ed8d832ab6cdae52aed289f06274a7b0de047b"

def initialize_session_state():
    if 'messages' not in st.session_state:
        st.session_state['messages'] = []
    if 'conversation_history' not in st.session_state:
        st.session_state['conversation_history'] = []

def get_bot_response(prompt, conversation_history):
    try:
        # Prepare the conversation history in the format Together AI expects
        formatted_history = ""
        for msg in conversation_history:
            formatted_history += f"{'Human' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}\n"
        
        # Add the current prompt
        formatted_history += f"Human: {prompt}\nAssistant:"

        # Call Together AI API with proper response handling
        response = together.Complete.create(
            prompt=formatted_history,
            model="mistralai/Mistral-7B-Instruct-v0.2",
            max_tokens=1024,
            temperature=0.7,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1,
            stop=['Human:', '\n\n']
        )
        
        # Properly access the response text
        if isinstance(response, dict) and 'choices' in response:
            return response['choices'][0]['text'].strip()
        elif isinstance(response, dict):
            # For debugging
            st.write("API Response structure:", response)
            return "Error: Unexpected response format"
        else:
            return "Error: Invalid response from API"
            
    except Exception as e:
        st.error(f"Error: {str(e)}")
        return f"Error: {str(e)}"

def save_conversation():
    if st.session_state.messages:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"conversation_{timestamp}.json"
        with open(filename, 'w') as f:
            json.dump(st.session_state.messages, f, indent=2)
        return filename
    return None

# Set up the Streamlit page
st.set_page_config(page_title="AI Chatbot", page_icon="🤖")
st.title("💬 AI Chatbot")

# Initialize session state
initialize_session_state()

# Sidebar for configuration
with st.sidebar:
    st.title("Settings")
    if st.button("Clear Conversation"):
        st.session_state.messages = []
        st.session_state.conversation_history = []
    
    if st.button("Save Conversation"):
        filename = save_conversation()
        if filename:
            st.success(f"Conversation saved to {filename}")
    
    # # Add API key input in sidebar
    # api_key = st.text_input("Enter Together AI API Key", type="password")
    # if api_key:
    #     together.api_key = api_key

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

# Chat input
if prompt := st.chat_input("What's on your mind?"):
    # Check if API key is set
    if not together.api_key:
        st.error("Please enter your Together AI API key in the sidebar.")
    else:
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        st.session_state.conversation_history.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.write(prompt)
        
        # Get and display assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response = get_bot_response(prompt, st.session_state.conversation_history)
                st.write(response)
        
        # Add assistant response to chat history if it's not an error
        if not response.startswith("Error:"):
            st.session_state.messages.append({"role": "assistant", "content": response})
            st.session_state.conversation_history.append({"role": "assistant", "content": response})

# Add CSS to improve chat appearance
st.markdown("""
    <style>
    .stChatMessage {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .stChatMessage[data-test="user"] {
        background-color: #e6f3ff;
    }
    .stChatMessage[data-test="assistant"] {
        background-color: #f0f2f6;
    }
    </style>
    """, unsafe_allow_html=True)



