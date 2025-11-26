# Potato Doc – AI-Powered Plant Disease Diagnostics

<p align="center">
  <strong>A full-stack web application for diagnosing potato plant diseases using deep learning and providing expert advice through an integrated AI assistant.</strong>
</p>

<p align="center">
  A Major Project Report submitted in partial fulfillment of the requirements for the degree of Bachelor of Technology
  <br>
  by
  <br>
  <strong>Satwik Singh (22U03036)</strong> and <strong>Arpit Raj (22U03034)</strong>
</p>

---

## Project Overview

**Potato Doc** is an intelligent diagnostic tool designed to help farmers and agricultural enthusiasts identify common potato plant diseases—specifically Early Blight and Late Blight—from leaf images. The platform combines a powerful Convolutional Neural Network (CNN) for accurate image classification with a sophisticated AI chatbot, powered by Google's Gemini, to offer tailored advice and treatment recommendations.

The system provides an intuitive user experience through a modern React-based frontend, allowing users to upload an image and receive an instant diagnosis, a confidence score, and a visual heatmap (a Grad-CAM simulation) highlighting the affected areas of the leaf.

---

## Core Features

*   **Deep Learning Diagnosis:** Utilizes a custom-trained CNN model to classify potato leaves as **Healthy**, **Early Blight**, or **Late Blight** with high accuracy.
*   **Interactive Heatmap Visualization:** Generates a Grad-CAM-like heatmap overlay on the uploaded image, providing a clear visual indication of diseased regions, which helps in understanding the model's decision-making process.
*   **AI Agricultural Assistant:** An integrated chatbot, powered by the Gemini 2.5 Pro API, provides expert, context-aware advice based on the diagnosis. It can answer follow-up questions about treatment, prevention, and general crop care.
*   **Modern, Responsive UI:** A sleek and performant frontend built with React and Framer Motion, ensuring a seamless experience on both desktop and mobile devices.
*   **Full-Stack Architecture:** A complete end-to-end system with a Python/FastAPI backend serving the AI assistant and a decoupled frontend for a scalable and maintainable structure.

---

## System Architecture

The project is architected as a decoupled full-stack application, leveraging a modern technology stack for each component.

*   **Frontend (Client-Side):**
    *   A responsive web application built with **React**.
    *   Handles user interactions, image uploads, and renders the diagnosis, statistics, and heatmap.
    *   Communicates with two primary backend services: the Hugging Face model for prediction and the Vercel-hosted API for the AI chat assistant.
    *   Hosted on **Vercel**.

*   **Backend (Server-Side):**
    *   A lightweight API built with **Python** and **FastAPI**.
    *   Integrates with the **Google Gemini API** to provide the AI chat functionality.
    *   Deployed as a **Vercel Serverless Function** for scalability and cost-efficiency.

*   **Machine Learning Model:**
    *   A **Convolutional Neural Network (CNN)** trained in a Jupyter Notebook using **TensorFlow/Keras**.
    *   The model is hosted on **Hugging Face Spaces** for inference, allowing the frontend to directly query it for disease prediction. This decouples the heavy ML model from the primary application backend.

---

## Technology Stack

| Category          | Technologies                                                              |
| ----------------- | ------------------------------------------------------------------------- |
| **Frontend**      | React, JavaScript, Axios, Framer Motion, CSS3                             |
| **Backend**       | Python, FastAPI, Google Gemini API                                        |
| **ML Model**      | TensorFlow, Keras, NumPy, Matplotlib                                      |
| **Deployment**    | Vercel (Frontend & Backend API), Hugging Face Spaces (ML Model Inference) |
| **Dataset**       | PlantVillage Dataset                                                      |
| **Development**   | VS Code, Git & GitHub, Jupyter Notebook                                   |

---

## Getting Started

### Prerequisites

*   Node.js (v18 or newer)
*   Python (v3.9 or newer)
*   `pip` and `virtualenv`
*   A `GOOGLE_API_KEY` for the Gemini chatbot.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ssatwik975/potato-doc.git
    cd potato-doc
    ```

2.  **Setup the Frontend:**
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The React development server will start on `http://localhost:3000`.

3.  **Setup the Backend API:**
    *   Navigate to the `api` directory and create a virtual environment.
        ```bash
        cd ../api
        python -m venv venv
        source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
        ```
    *   Install the required Python packages.
        ```bash
        pip install -r requirements.txt
        ```
    *   Create a `.env` file in the `api` directory and add your Google API key:
        ```
        GOOGLE_API_KEY="YOUR_API_KEY_HERE"
        ```
    *   Run the FastAPI server using Uvicorn.
        ```bash
        uvicorn main:app --reload --port 8000
        ```
        The backend API will be available at `http://localhost:8000`.

### Running the Full Application

With both the frontend and backend servers running, you can access the full application at `http://localhost:3000`. The React app is configured to proxy API requests to the appropriate backend services.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
