<template>
    <div class="abilities mb-7">
        <h2 class="mb-5">  Eğitmen olmak için formu doldurunuz  </h2>
            <label for="abilities" class="block text-900 text-xl font-medium mb-2">Yetenekler</label>
            <InputText id="abilities" type="text" placeholder="Yetenek Ekleyiniz" class="w-full md:w-30rem mb-2" style="padding: 1rem" v-model="currAbility"  @keypress.enter="addSkill"/>
            <Button class="mb-2" @click="addSkill">
                Yetenek Ekle
            </Button>
            <div class="abilities-section mb-5">
                <div  v-for="ability in abilities" :key="ability" class="hobby-container">
                    <p style="font-size: large; font-style: italic;">
                        {{ ability }}
                    </p>
                    <i class="pi pi-trash" @click="removeAbility(ability)"></i>
                </div>
            </div>
            <label for="certificates" class="block text-900 text-xl font-medium mb-2">Sertifikalar</label>
            <InputText id="certificates" type="text" placeholder="Sertifika Ekleyiniz" class="w-full md:w-30rem mb-2" style="padding: 1rem" v-model="currCertificate" @keypress.enter="addCertificate"/>
            <Button class="mb-2" @click="addCertificate">
                Sertifika ekle
            </Button>
            <div class="certificates-section mb-5">
                <div  v-for="certificate in certificates" :key="certificate" class="hobby-container">
                    <p style="font-size: large; font-style: italic;">
                        {{ certificate }}
                    </p>
                    <i class="pi pi-trash"  @click="removeCertificate(certificate)"></i>
                </div>
            </div>
        <Button @click="submitHandler">
            Eğitmen Ol
        </Button>
    </div>
    <Dialog v-model:visible="visible" modal>
        <p>Tebrikler Başarıyla Eğitmen Oldunuz</p>
        <template #footer>
            <Button @click="finishSeller">Onayla</Button> 
        </template> 
    </Dialog>
</template>

<script>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import { useStore } from 'vuex';
export default {
    data(){
        return{
            store:useStore(),
            currAbility:"",
            currCertificate:"",
            abilities:[],
            certificates:[],
            studyInfo: "",
            visible:false
        }
    },
    components:{
        Button,
        InputText,
        Dialog
    },
    methods:{
        submitHandler(){
            this.$axios.put("/users/fillProfile",{
                id: this.store.getters.getUserId,
                name : this.store.getters.getName,
                studyInfo : this.studyInfo,
                certificates : this.certificates,
                hobbies : this.hobbies,
                abilities : this.abilities,
            })
            console.log(this.store.getters.getUserId)
            this.$axios.put("/users/beseller/"+this.store.getters.getUserId)
            this.visible = true;

        },
        addCertificate(){
            this.certificates.push(this.currCertificate)
            this.currCertificate = ""
        },
        addSkill(){
            this.abilities.push(this.currAbility)
            this.currAbility = ""
        },
        removeAbility(ability){
            this.abilities = this.abilities.filter(ab => ab != ability)
        },
        removeCertificate(certificate){
            this.certificates = this.certificates.filter(cer => cer != certificate)
        },
        finishSeller(){
            this.store.dispatch("updateIsSeller", 1)
            this.$router.push("/")
        }
    },
    mounted(){
        this.$axios.get("/users/getById/"+ this.store.getters.getUserId).then((resp)=>{
            this.studyInfo = resp.data.studyInfo
            this.certificates = resp.data.certificates
            this.hobbies = resp.data.hobbies
            this.abilities = resp.data.abilities
        })
    }
}
</script>

<style scoped>
    .abilities{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .hobby-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 250px;
        box-shadow:1px ;
        margin-bottom: 3px;
        padding: 3px;
        border-radius: 10px;
    }
</style>