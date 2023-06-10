<template>
    <div class="offer-card">
      <div class="offer-header mb-6" style="margin-bottom: 80px;">
        <h3>{{ offer.title }}</h3>
        <p>{{ offer.description }}</p>
      </div>
      <div class="offer-details" >
        <div class="detail">
          <span class="label">Kategori:</span>
          <span class="value">{{ offer.category }}</span>
        </div>
        <div class="detail">
          <span class="label">İlanı Oluşturan:</span>
          <span class="value mr-2">{{ offer.creator }}</span>
          <p class="go-to-profile" @click="goToProfile"> Profile Git </p>
        </div>
        <div class="detail">
          <span class="label">İlan Süresi:</span>
          <span class="value">{{ offer.duration }} days</span>
        </div>
        <div class="detail">
          <span class="label">İlan Yayın Tarihi:</span>
          <span class="value">{{ formatDate(offer.creationDate) }}</span>
        </div>
        <div class="detail">
          <span class="label">Kontenjan:</span>
          <span class="value">{{ offer.applicantQuota }}</span>
        </div>
        <div class="detail">
          <span class="label">Platform:</span>
          <span class="value">{{ offer.platform }}</span>
        </div>
        <div class="detail">
          <span class="label">Fiyat:</span>
          <span class="value">{{ offer.price }} ₺</span>
        </div>
      </div>
      <div>
      </div>
    </div>
  </template>
  
  <script>
  import Button from "primevue/button"
  export default {
    name: 'OfferCard',
    data(){
      return{
        applicants:[]
      }
    },
    props: {
      offer: {
        type: Object,
        required: true,
      },
      selfAd:{
        type: Number,
        required: false,
      },
      userId:{
        type:Number,
        required: true,
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      goToProfile(){
        this.$router.push({name: "profile" , params:{userId : this.userId}})
      },
      getApplicants(offer){
        if(this.selfAd == 1){
        for(let i = 0 ; i < offer.applicantsNumber;i++){
          this.$axios.get("/users/getById/"+this.offer.applicants[i]).then(resp=>{
            console.log(resp.data)
            this.applicants.push(resp.data);
          })
        }
        
      }
      }
    },
    components:{
      Button,
    },
    watch :{
      props(newProps, oldProps){
        getApplicants(newProps);
      }
    },
    computed:{
      props(){
        return this.offer
      }
    },
  };
  </script>
  
  <style scoped>

  .go-to-profile{
    color: rgb(145, 142, 142);
  }
  .go-to-profile:hover{
    color: rgb(99, 99, 199);
    cursor: pointer;
  }
  .offer-card {
    background-color: #f0f0f0;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .offer-header {
    margin-bottom: 10px;
  }
  
  .offer-details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 10px;
    font-size: 14px;
  }
  
  .detail {
    display: flex;
    align-items: center;
  }
  
  .label {
    font-weight: bold;
    margin-right: 5px;
  }
  
  .value {
    word-break: break-word;
  }
  </style>