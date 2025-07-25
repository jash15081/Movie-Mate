# 🎬 Movie Review & Recommendation System

A scalable, multi-service movie recommendation platform powered by machine learning and deep content filtering. The system uses real user reviews to predict movie ratings and recommend similar movies based on genres, cast, directors, and descriptions.

---

## 🧠 Key Features

- 📝 **Review-based Rating Prediction** using Regression (FastAPI)
- 🎯 **Content-Based Movie Recommendation** using TF-IDF + Cosine Similarity
- ⚡ **Vector Caching** to avoid redundant TF-IDF computations
- 🧠 **User Preference Vector** dynamically generated from liked movies
- 📊 **IMDB 1000 Movies Dataset** for realistic movie metadata
- 🧪 **Three-Service Architecture**: React (UI) + Express (API) + FastAPI (ML)

---

## 🛠️ Tech Stack

| Layer         | Tech/Library                |
|---------------|-----------------------------|
| Frontend      | React.js                    |
| Backend API   | Node.js + Express.js        |
| ML API        | FastAPI (Python)            |
| ML Model      | Linear Regression (Rating)  |
| Recommendation| TF-IDF + Cosine Similarity  |
| DB/Storage    | JSON/NumPy Cache + MongoDB (if any) |
| Dataset       | IMDB 1000 Movies Dataset    |

---

## 🚀 Architecture Overview

```text
+-------------+         +--------------+         +--------------------+
|  React App  | <--->   | Express API  | <--->   |   FastAPI (ML API) |
+-------------+         +--------------+         +--------------------+
       ↑                        ↓                         ↓
   User Inputs         Movie & Review Data        Rating Prediction
   Movie Likes         Handles Routing/API        Recommendation Engine
```

---

## ⚙️ How It Works

1. **User submits a review** on a movie.
2. Review is sent to **FastAPI regression model** to predict a rating.
3. Review & rating are stored and sent to **recommendation engine**.
4. The engine:
   - Converts all movie metadata into TF-IDF vectors (cached using `.npy` file)
   - Computes a **user preference vector** from liked movies
   - Calculates **cosine similarity** between this vector and all movie vectors
   - Returns top-N similar movies
5. Resulting recommendations are returned to the frontend and shown to the user.

---

## ⚡ Caching Mechanism

- TF-IDF vectors of all movies are **precomputed and stored in a NumPy `.npy` file**.
- On startup, the system **loads the cache** to avoid recomputation.
- New movies can be added with on-demand embedding update.

---

## 📂 Project Structure

```
movie-review-system/
│
├── Frontend/              # React frontend
├── Backend/              # Express.js backend API
├── ML/                  # FastAPI ML service
└── README.md
```

---

## 🧪 Example Use Case

1. User logs in and writes: _“Amazing action and thrilling sequences”_ for **Inception**.
2. FastAPI predicts rating: **4.5/5**
3. User likes the movie → System updates preference vector.
4. Recommendations returned: **Interstellar**, **The Matrix**, **Tenet**, etc.

---

## 🧬 ML & Recommendation Details

- **Regression Model**: Trained on text reviews and actual ratings to predict new ratings.
- **Recommendation Model**:
  - TF-IDF vectorization on `description`, `cast`, `director`, and `genre`
  - User vector formed by averaging liked movie vectors
  - Cosine similarity used to find most similar movies

---

## 🔧 Setup Instructions

1. **Clone Repository**

```bash
git clone https://github.com/jash15081/Movie-Mate.git
cd movie-recommendation-system
```

2. **Install & Run FastAPI ML Service**

```bash
cd ML
pip install -r requirements.txt
uvicorn main:app --reload
```

3. **Install & Run Express Backend**

```bash
cd Backend
npm install
npm start
```

4. **Install & Run React Frontend**

```bash
cd Frontend
npm install
npm start
```

---

## 📈 Future Improvements

- Add collaborative filtering for hybrid recommendations
- Integrate vector database (e.g., FAISS) for large-scale similarity search
- Add authentication, user history, and favorites
- Deploy with Docker + Kubernetes for scalability

---

## 📄 License

MIT License © 2025 Jaimin Patel
