

<template>
    <div class="profile-header">
        <img :src="profile.imgSrc ? profile.imgSrc : '../../public/layout/images/logo-dark.svg'" alt="" style="width: 40xp; height:40px; border-radius: 50%; margin-right: 5px ;">
        <h1 :class="isOnline ? 'green':'red'">{{profile.name}}</h1>
    </div>
    <Dialog v-model:visible="visible" modal header="Kullanıcıya Puan Ver" style="display: flex; flex-direction: column; width: 25%;">
      <Rating v-model="starValue" />
      <template #footer>
        <Button @click="submitStars" label="Puan ver"/>
      </template>
    </Dialog>
    <div class="profile">
      <div class="rate" style="display: flex; float: right;" v-if="store.getters.getUserId != profile.id">
          <p @click="visible = true" class="rate-link font-bold" style="margin-left: auto;">Kullanıcıya puan ver</p>
      </div>
      <div class="profile-content">
        <div class="flex">
          <p class="font-bold mr-1">Kullanıcı adı: </p>
          <p>{{ profile.name }}</p>
        </div>
        <div class="flex">
          <p class="font-bold mr-1">Öğrenim bilgileri: </p>
          <p>{{ profile.studyInfo }}</p>
        </div>        
        <div class="flex">
          <p class="mr-1 font-bold">Hobileri:</p>
          <p v-for="hobby in profile.hobbies" :key="hobby" class="mr-2"> {{ hobby + (profile.hobbies[profile.hobbies.length -1] == hobby ? "" : ",") }}</p>
        </div>
        <div v-if="profile.isSeller == 1" class="flex">
          <p class="mr-1 font-bold">Yetenekleri:</p>
          <p v-for="ability in profile.abilities" :key="ability" class="mr-2"> {{ ability + (profile.abilities[profile.abilities.length -1] == ability ? "" : "," )}}</p>
        </div>
        <div v-if="profile.isSeller == 1" class="flex">
          <p class="mr-1 font-bold">Sertifikaları:</p>
          <p v-for="certificate in profile.certificates" :key="certificate" class="mr-2"> {{ certificate + (profile.certificates[profile.certificates.length -1] == certificate ? "" : ",") }}</p>
        </div>
        <div v-if="profile.isSeller == 1" class="profile-stars">
          <p class="mr-2 font-bold">Yıldızlar:</p>
          <div style="display: flex; align-items: center;">
              <p style="font-weight: lighter; font-size: small;" class="mr-2">{{ profile.star ? profile.star.length : 0}} kullanıcıdan</p>
              <Rating :modelValue="getUserStar(profile)" readonly :cancel="false" style="margin-left: 3px;margin-bottom: auto;"/>
          </div>
        </div>
      </div>
      
      <!-- <p>Bio: {{ profile.bio }}</p> -->
      <div class="ads-header">
          <h4 @click="appliedAds()" :class="this.applied ? 'ad-opts blue': 'ad-opts'">Başvurulan İlanlar</h4>
          <h4 @click="selfAds()" :class="this.self ? 'ad-opts blue': 'ad-opts'">Kullanıcı İlanları</h4>
        </div>
      <div v-if="profile.isSeller == 1 && self" class="ads"> 
        <Card v-for="advert in profile.adverts" :key="advert.id" class="advert" @click="this.$router.push({name:'advert', params:{advertId:advert.id}})" >
            <template #title> 
                <div class="card-title">
                    <div class="user">
                        <img :src="advert.userImg ? advert.userImg : '../../public/layout/images/logo-dark.svg' " alt="user-img" style="border-radius: 50%; max-height: 30px; max-width: 30px; margin-right: 3px;">
                        <p>{{profile.name}} </p>
                    </div>
                </div>  
            </template>
            <template #content>
                <p>
                    {{advert.description}}
                </p>
                <p style="float: left;">{{ advert.category.name}}</p>
                <p style="float: right;"> {{ advert.price }} ₺</p>
            </template>
        </Card>
      </div>
      <div v-if="applied">
        <Card v-for="advert in appliedAdverts" :key="advert.id" class="advert" @click="this.$router.push({name:'advert', params:{advertId:advert.id}})">
            <template #title> 
                <div class="card-title">
                    <div class="user">
                        <img :src="advert.userImg ? advert.userImg : '../../public/layout/images/logo-dark.svg' " alt="user-img" style="border-radius: 50%; max-height: 30px; max-width: 30px; margin-right: 3px;">
                        <p>{{advert.user.name}} </p>
                    </div>
                </div>  
            </template>
            <template #content>
                <p>
                    {{advert.description}}
                </p>
                <p style="float: left;">{{ advert.category.name}}</p>
                <p style="float: right;"> {{ advert.price }} ₺</p>
            </template>
        </Card>
      </div>

      <Button v-if="store.getters.getUserId == profile.id " @click = "profileFillHandler(profile.id)">
        Profili Düzenle
      </Button>
    </div>
  </template>
  
  <script>
    import Button from 'primevue/button'
    import Card from 'primevue/card'
    import Rating from 'primevue/rating'
    import { useStore } from 'vuex'
    import Dialog from 'primevue/dialog'
    export default{
            data(){
                return{
                    profile:[],
                    store: useStore(),
                    appliedAdverts:[],
                    applied:false,
                    self:true,
                    visible : false,
                    starValue: 0,
                }
            },
            mounted(){
                this.$axios.get('/users/getById/'+this.$route.params.userId)
                .then(response => {
                    console.log(response.data)
                    this.profile = response.data
                })
                this.$axios.get("/adverts/getApplied/"+this.store.getters.getUserId).then(resp =>{
                  console.log(resp.data)
                  if(this.store.getters.getUserId == this.$route.params.userId){
                    this.appliedAdverts = resp.data;
                  }else{
                    this.appliedAdverts = resp.data.filter( ad => ad.user.id == this.$route.params.userId)
                  }
                })
            },
            components:{
                Card,
                Button,
                Rating,
                Dialog
            },
            computed:{
                isOnline(){
                    if(this.profile.logStatus == 1){
                        return true;
                    }else{
                        return false;
                    }
                },
            },
            methods:{
              profileFillHandler(id){
                this.$router.push({name: "fillProfilePage", params:{id:id}})
              },
              selfAds(){
                this.self = true;
                this.applied = false;
              },
              appliedAds(){
                this.applied = true;
                this.self = false;
              },
              submitStars(){
                console.log(this.store.getters.getUserId,this.starValue)
                  this.$axios.put("/users/comment",{
                    userId : this.$route.params.userId,
                    points: this.starValue,
                  }).then(()=>{
                    this.visible = false;
                  })
              },
              getUserStar(profile){
                if(profile.star == null){
                  return 0;
                } else{
                  return profile.star.reduce((x,y) => x+y)/profile.star.length;
                }
        },
            }
        }
  </script>
  
  <style scoped>
  .certificates{
    display: flex;
    justify-content: flex-start;

  }
  .ad-opts:hover{
    cursor: pointer;
  }
  .rate-link:hover{
    color:rgb(99, 99, 199);
    cursor: pointer;
  }
  .profile-content{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .profile {
    margin: 0 auto;
    padding: 20px;
    background-color: #f5ecec;
    border-radius: 5px;
  }
  
  
  .p-grid {
    margin-top: 10px;
  }
  
  .p-col-12 {
    margin-bottom: 10px;
  }
  
  @media (min-width: 768px) {
    .p-col-12 {
      width: 33.33%;
    }
  }
  .green{
    color:green;
  }
  .red{
    color:red;
  }
  .profile-header{
    display: flex;
    align-items: center;
  }
  .advert{
        margin-bottom: 10px;
    }
    .card-title{
        justify-content: space-between;
        display: flex;
        align-items: center ;
    }
    .stars{
        display: flex;
        justify-content:center;
        float: right;
        align-items: center;
        align-content: center;
    }
    .stars >*{
        margin-left:5px;
    }
    .user{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ads-header{
      margin-top: 70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .profile-stars{
      display: flex;
    }
    .blue{
      color: blue;
    }
  </style>