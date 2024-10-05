// Select HTML elements
const textArea = document.getElementById('text_to_summarize');
const submitButton = document.getElementById('submit-button');
const outputDiv = document.getElementById('output-div');
const summarizedTextArea = document.getElementById('summarized_text');
const copyButton = document.getElementById('copy-button');
const loadingMessage = document.getElementById('loading-message');

// Add event listeners
textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);
copyButton.addEventListener("click", copyToClipboard);

// Function to verify the length of the text input
function verifyTextLength(e) {
    const textarea = e.target;
    // Check if the text in the text area is the right length - between 200 and 100,000 characters
    if (textarea.value.length >= 10 && textarea.value.length <= 1000) {
        submitButton.disabled = false; // Enable the submit button
    } else {
        submitButton.disabled = true; // Disable the submit button
    }
}

// Function to submit the data to the backend
async function submitData(e) {
    e.preventDefault(); // Prevent the default form submission behavior
    submitButton.classList.add("submit-button--loading");
    const text_to_summarize = textArea.value;

    // Show loading message
    loadingMessage.style.display = 'block';
    summarizedTextArea.style.display = 'none';
    copyButton.style.display = 'none';

    try {
        const response = await fetch('http://localhost:3000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text_to_summarize })
        });

        const result = await response.json();
        if (response.ok) {
            summarizedTextArea.value = result.summary;
            summarizedTextArea.style.display = 'block';
            copyButton.style.display = 'block';
        } else {
            summarizedTextArea.value = `Error summarizing text: ${result.error}`;
            summarizedTextArea.style.display = 'block';
        }
    } catch (error) {
        summarizedTextArea.value = `Error summarizing text: ${error.message}`;
        summarizedTextArea.style.display = 'block';
    } finally {
        // Hide loading message
        loadingMessage.style.display = 'none';
        submitButton.classList.remove("submit-button--loading");
    }
}

// Function to copy the summarized text to the clipboard
function copyToClipboard() {
    summarizedTextArea.select();
    summarizedTextArea.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    copyButton.innerHTML = 'Copied!';
    setTimeout(() => {
        copyButton.innerHTML = 'Copy';
    }, 2000);
}
