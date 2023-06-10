<template>
    <div>
        <AdvertCard :offer="offerData" :userId = "userId" :selfAd ="selfAd" class="mb-5" />
        <Button v-if="selfAd != 1" :disabled="checkIfAdvertAvailable" @click="handleSubmit">Katıl</Button>
        <Dialog v-model:visible="visible" modal header="Eğitimciye Sorun" :style="{ width: '33%' }">
            <div class="question">
                <TextArea id="question" v-model="question" cols="70" rows="8" placeholder="Sormak istediklerinizi buraya yazın yoksa boş bırakabilirsiniz"/>    
            </div>
            <template #footer>
                <Button @click="sendQuestion">Gönder</Button>
            </template>
        </Dialog>
    </div>
</template>
<script>
import AdvertCard from '@/components/AdvertCard.vue'; 
import Button from 'primevue/button';
import { useStore } from 'vuex';
import Dialog from 'primevue/dialog';
import TextArea from 'primevue/textarea';
import emailjs from '@emailjs/browser';
export default {
    components: {
        AdvertCard,
        Button,
        Dialog,
        TextArea,
    },
    data() {
        return {
            store:useStore(),
            userId:0,
            visible:false,
            question:"",
            creatorEmail:"",
            platformCode:"",
            offerData: {   
                creatorId: 0,
                title: '',
                description: '',
                category: '',
                creator: '',
                duration: 0,
                creationDate: '',
                applicantQuota: 0,
                applicants: [],
                applicantNumber: 0,
                platform: '',
                price: 0,
            },
        };
    },
    methods:{
        handleSubmit(){
            if(this.offerData.applicants != null){
                console.log(this.offerData.applicants)
                if(this.offerData.applicants.includes(this.store.getters.getUserId)){
                alert("Bu derse zaten kaydoldunuz")
                }else{
                    this.visible = true;
                }
            }else{
                this.visible = true;
            }  
        },
        sendQuestion(){
            this.$axios.put("/adverts/advert/apply",{
                    userId:this.store.getters.getUserId,
                    advertId: this.$route.params.advertId
                }).then(()=>{
                    if(this.question != "" && this.question.length > 5){
                        console.log(this.creatorEmail)
                            emailjs.send('service_s7ue4yo', 'template_44xueml',{to_name: this.offerData.creator, from_name:this.store.getters.getName, to_email: this.creatorEmail, advert_title: this.offerData.title, message: this.question, reply_to: this.store.getters.getName},"r8MdRccBFJkMtU-E-" ).then(function(response) {
                            console.log('Başarılı!', response.status, response.text);
                        }, function(error) {
                            console.log('Hatalı...', error);
                        });
                    }
                    console.log(this.store.getters.getEmail)
                    emailjs.send('service_s7ue4yo','template_0oe628a',{to_name: this.store.getters.getName, from_name:this.offerData.creator, to_email: this.store.getters.getEmail, message: this.offerData.platform + " Kodunuz " + this.platformCode, reply_to: this.offerData.creator},"r8MdRccBFJkMtU-E-").then(function(response) {
                            console.log('Başarılı!', response.status, response.text);
                        }, function(error) {
                            console.log('Hatalı...', error);
                        });
                    alert("ilana başvurunuz tamamlandı")
                    this.$router.push("/");
                })
        }
    },
    mounted(){
         this.$axios.get("/adverts/advert/"+this.$route.params.advertId).then( (resp) => {
            this.offerData.applicantNumber = resp.data.applicants ? resp.data.applicants.length : 0;
            this.offerData.applicants = resp.data.applicants ? resp.data.applicants : [] ;
            this.userId=resp.data.userId;
            this.offerData.title = resp.data.description;
            this.offerData.description = resp.data.detailedDescription;
            this.offerData.category = resp.data.categoryName;
            this.offerData.creator = resp.data.userName;
            this.creatorEmail = resp.data.userEmail;
            this.offerData.duration = resp.data.duration;
            this.offerData.creationDate = resp.data.publishDate;
            this.offerData.applicantQuota = resp.data.quota;
            this.offerData.platform = resp.data.platform;
            this.offerData.price = resp.data.price;
            this.platformCode = resp.data.platformCode;
        })
    },
    computed:{
        checkIfAdvertAvailable(){
            if(this.store.getters.getUserId == this.userId || this.offerData.duration == 0 ){
                return true;
            }else{
                return false;
            }
        },
        selfAd(){
            if(this.store.getters.getUserId == this.userId){
                return 1;
            }else{
                return 0;
            }
        }
    }
};
</script>
<style>
    .question{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>