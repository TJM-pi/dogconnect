<template>
<transition name="modal-fade">
  <div class="image container">
    <input
      type="file"
      id="selectedFile"
      @change="previewImage"
      accept="image/*"
    />
    <div class="field">
      <button class="btn blue" @click.prevent="getImage">Image</button>
    </div>
    <div class="image-preview" v-if="imageData.length > 0">
      <img class="preview" :src="imageData" />
    </div>
  </div>
</transition>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  name: "UploadImage",
  data() {
    return {
      imageData: ""
    };
  },
  methods: {
    getImage() {
      document.getElementById("selectedFile").click();
    },
    previewImage: function(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
          this.imageData = e.target.result;
          this.$emit('send', this.imageData)
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  },
};
</script>

<style lang="scss">
.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 1s ease;
}

.image .image-preview{
  text-align: center;
}

.image img.preview {
  max-width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 5px;
}

#selectedFile {
  display: none;
}

.image {
    max-width: 400px;
    margin-top: 60px;
}

.image h2 {
    font-size: 4.2em;
}

.image .btn {
  margin-left: 80px;
  margin-top: -80px;
}
</style>