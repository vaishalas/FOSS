<template>
  <div class="image-gallery">
    <form @submit.prevent="addImage">
      <input type="file" name="image" id="image" accept="image/*" @change="onFileChange">
      <button type="submit">Upload</button>
    </form>

    <!-- Display all images -->
    <div v-if="images.length" class="gallery">
      <h3>Uploaded Images:</h3>
      <div class="images">
        <transition-group name="fade" tag="div">
          <img v-for="(image,index) in images" :key="index" :src="image" alt="Uploaded Image" />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data() {
    return {
      selectedFile: null,
      images: [] // To store the URLs of all images
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log("File selected:", this.selectedFile);
    },
    async addImage() {
      if (!this.selectedFile) {
        alert("Please select a file first.");
        return;
      }

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      console.log("Uploading file...");
      try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.data && res.data.imageUrl) {
          console.log("Upload successful:", res.data.imageUrl);
          // Add the new image URL to the images array
          this.images.push(res.data.imageUrl);
        } else {
          console.log("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    async loadImages() {
      try {
        const res = await axios.get("http://localhost:5000/images");
        this.images = res.data;
      } catch (error) {
        console.error("Error loading images:", error);
      }
    }
  },
  created() {
    // Load all images when the component is created
    this.loadImages();
    console.log(this.images)
  }
}
</script>

<style scoped>
.image-gallery {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #f7f9fc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.image-gallery form {
  margin-bottom: 20px;
}

.image-gallery input[type="file"] {
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #3498db;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.image-gallery input[type="file"]:hover {
  border-color: #2980b9;
}

.image-gallery button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.image-gallery button:hover {
  background-color: #2980b9;
}

.gallery {
  margin-top: 20px;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.images img {
  max-width: 150px;
  height: auto;
  border-radius: 10px;
  border: 3px solid #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  transform: scale(0.8);
}

.images img:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.8);
}
</style>
