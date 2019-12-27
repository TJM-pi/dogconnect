<template>
<div class="container-fluid" style="text-align:center;">
    <input
      type="file"
      class="form-control-file"
      id="selectedFile"
      @change="previewImage"
      accept="image/*"
    />
    <button type="button" class="btn btn-primary" @click.prevent="getImage">Upload image</button>
</div>
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
.btn{
  margin-top:15px;
}
.image {
    max-width: 400px;
    margin-top: 60px;
}
.image h2 {
    font-size: 4.2em;
}
</style>