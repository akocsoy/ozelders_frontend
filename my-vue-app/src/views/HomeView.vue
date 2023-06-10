<template >
  <div class="card-container" >
    <h1>Açık İlanlar</h1>
        <Card v-for="advert in filteredAdverts" :key="advert.id" class="advert" @click="this.$router.push({name:'advert', params:{advertId:advert.id}})">
            <template #title> 
                <div class="card-title">
                    <div class="user">
                        <img :src="advert.userImg ? advert.userImg : '../../public/layout/images/logo-dark.svg' " alt="user-img" style="border-radius: 50%; max-height: 30px; max-width: 30px; margin-right: 3px;">
                        <p>{{advert.userName}} </p>
                    </div>
                    
                    <div class="stars">
                        <p style="font-weight: lighter; font-size: small;">{{ advert.userStar ? advert.userStar.length : 0}}</p>
                        <i class="pi pi-user"></i>
                        {{ starValue(advert) }}
                        <Rating v-model="value" readonly :cancel="false" style="margin-left: 15px;"/>
                    </div>
                </div>  
            </template>
            <template #content>
                <p>
                    {{advert.description}}
                </p>
                <p style="float: left;">{{ advert.categoryName}}</p>
                <p style="float: right;"> {{ advert.price }} ₺</p>
            </template>
        </Card>
    <p v-if="filteredAdverts.length == 0" style="font-weight: bolder; font-size: large; color: rgb(179, 63, 18);"> Size uygun bir ilan bulunamadı </p>
  </div>
</template>

<script>
import Card from 'primevue/card'
import Rating from 'primevue/rating'
import { useStore } from 'vuex'
export default {
    data(){
        return{
            adverts:[],
            value:0,
            store: useStore(),
        }
    },
    components:{
        Card,
        Rating,
    },
    mounted(){
        this.getAdverts();
    },
    computed:{
        categoryId(){
            return this.store.getters.getCategoryId
        },
        filteredAdverts(){
            return this.getSearchedAdverts.filter(advert => advert.userId != this.store.getters.getUserId && advert.quota != 0 && advert.applicants == null || !advert.applicants.includes(this.store.getters.getUserId))
        },
        getSearchedAdverts(){
            return this.adverts.filter(ad => ad.description != null && ad.description.toLowerCase().includes(this.searchValue.toLowerCase()))
        },
        searchValue(){
            return this.store.getters.getSearchValue
        },
        starsSort(){
            return this.store.getters.getStarsSort;
        },
        priceSort(){
            return this.store.getters.getPriceSort;
        }
        
    },
    watch:{
        categoryId(newCategoryId, oldCategoryId){
            if(newCategoryId != oldCategoryId){
                this.getAdverts()
            }
        },
        starsSort(newStarsSort, oldStarsSort){
            if(newStarsSort != oldStarsSort){
                this.sortByStars()
            }
        },
        priceSort(newPriceSort, oldPriceSort){
            if(newPriceSort != oldPriceSort){
                this.sortByPrice()
            }
        }  
        },
    methods:{
        starValue(advert){
            if(advert.userStar == null){
                this.value = 0;
            } else{
                this.value = advert.userStar.reduce((x,y) => x+y)/advert.userStar.length;
            }
        },
        getUserStar(advert){
            if(advert.userStar == null){
                return 0;
            } else{
                return advert.userStar.reduce((x,y) => x+y)/advert.userStar.length;
            }
        },
        getAdverts(){
            if(this.categoryId != 0){
            this.$axios.get('/adverts/category/'+this.categoryId).then((res)=>{
                this.adverts = res.data;
            console.log(res)
        });
        }else{
            this.$axios.get('/adverts').then((res)=>{
            this.adverts = res.data;
                console.log(res)
            });
        }
        },
        sortByPrice(){
            if(this.store.getters.getPriceSort == 'INC'){
                this.adverts.sort(this.comparePrice);
            }else if(this.store.getters.getPriceSort == 'DESC'){
                this.adverts =  this.adverts.sort(this.comparePrice).reverse();
            }
            
        },
        sortByStars(){
            if(this.store.getters.getStarsSort == 'INC'){
                this.adverts.sort(this.compareStar);
            }else if(this.store.getters.getStarsSort == 'DESC'){
                this.adverts = this.adverts.sort(this.compareStar).reverse();
            }
            
        },
        compareStar(a,b){
            if(this.getUserStar(a) < this.getUserStar(b)){
                return -1
            }else if(this.getUserStar(a) > this.getUserStar(b)){
                return 1
            }else{
                return 0
            }
        },
        comparePrice(a,b){
            if(a.price < b.price){
                return -1
            }else if(a.price > b.price){
                return 1
            }else{
                return 0
            }
        },
        
    },
}
</script>

<style>
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
        justify-content: space-between;
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
</style>