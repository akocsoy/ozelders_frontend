<template>
    <h1 class="mb-5">Başvurduğun Eğitimler</h1>
    <h5 v-if="ads.length == 0">Henüz başvurun yok <a href="/">hemen başvur</a></h5>
    <div v-for="ad in getAds" :key="ad.id" style="display: flex; flex-direction: column; background-color: rgb(236, 236, 236); border-radius: 10px; padding: 10px; margin-bottom: 10px; width: 60%; max-height: fit-content;">
        <div class="ad-content">
            <h5>{{ ad.description }}</h5>
            <p style="font-size: smaller;"> {{ ad.detailedDescription }} </p>

            <div class="options" style="display: flex; float: right;">
                <Button @click="openVerification(ad.id)" label="Başvuruyu iptal et" severity="danger" text rounded size="small" aria-label="Cancel" style="margin-left: auto;"/>
            </div>
            <div class="flex" style="max-width: 50%;">
                <p class="font-bold mr-1" style="font-size: smaller;">Eğitmen :</p>
                <p style="font-size: smaller; margin-right: 3px;">{{ ad.user.name }}</p>
                <p class="go-to-profile" style="font-size: smaller;" @click="this.$router.push({name: 'profile' , params:{userId : ad.user.id}})"> Profile Git </p>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visible" modal >
        <div class="modalContainer" style="display: flex; flex-direction: column; justify-content: center;">
            <p>Başvuruyu iptal etmek istediğinize emin misiniz ?</p>
            <div class="options" style="display: flex; justify-content: space-between;">
                <Button severity="danger" @click="removeApplied(selectedAd)" >Evet</Button>
                <Button severity="success" @click="()=>{visible = false, selectedAd = null}">Hayır</Button>
            </div>
        </div> 
    </Dialog>
</template>

<script>
import { useStore } from 'vuex'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
export default {
    data(){
        return{
            store: useStore(),
            ads:[],
            visible: false,
            selectedAd:null,
        }
    },
    components:{
        Button,
        Dialog
    },
    mounted(){
        this.$axios.get("/adverts/getApplied/"+ this.store.getters.getUserId).then((resp)=>{
            this.ads = resp.data;
        })
    },
    computed:{
        getAds(){
            return this.ads;
        }
    },
    methods:{
        removeApplied(id){
            this.ads=this.ads.filter(ad => ad.id != id)
            this.$axios.put("/adverts/advert/removeApplicant",{
                id:id,
                userId: this.store.getters.getUserId,
            }).then(() =>{
                this.visible = false;
            })
            
        },
        openVerification(id){
            this.selectedAd = id;
            this.visible = true;
        }
    },
    
    
}
</script>

<style scoped>
.go-to-profile{
    color: rgb(145, 142, 142);
  }
  .go-to-profile:hover{
    color: rgb(99, 99, 199);
    cursor: pointer;
  }
</style>