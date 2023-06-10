<template>
    <div class="profile-form mt-5">
        <label for="name" class="block text-900 text-xl font-medium mb-2 ">İsim</label>
        <InputText id="name" type="text" :placeholder="name" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name"/>

        <label for="studyInfo" class="block text-900 text-xl font-medium mb-2">Öğrenim Bilgileri</label>
        <InputText id="studyInfo" type="text" :placeholder="studyInfo ? studyInfo : 'Öğrenim Bilgilerinizi Giriniz'" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="studyInfo"/>

        <label for="hobbies" class="block text-900 text-xl font-medium mb-2">Hobiler</label>
        <InputText id="hobbies" type="text" placeholder="Hobi Ekleyiniz" class="w-full md:w-30rem mb-2" style="padding: 1rem" v-model="currHobby"  @keypress.enter="addHobby"/>
        <Button class="mb-2" @click="addHobby">
            Hobi Ekle
        </Button>
        <div class="hobies-section mb-5">
            <div  v-for="hobby in hobbies" :key="hobby" class="hobby-container">
                <p style="font-size: large; font-style: italic;">
                    {{ hobby }}
                </p>
                <i class="pi pi-trash"  @click="removeHobby(hobby)"></i>
            </div>
        </div>

        <div class="abilities mb-7" v-if="isSeller == 1">
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
        </div>
        <Button @click="submitHandler">
            Profili Tamamla
        </Button>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useStore } from 'vuex';
export default {
    data(){
        return{
            store: useStore(),
            certificates:[],
            currCertificate:"",
            name:"",
            studyInfo:"",
            hobbies:[],
            abilities:[],
            currHobby:"",
            currAbility:"",
        }
    },
    mounted(){
        this.$axios.get("/users/getById/"+this.$route.params.id).then(resp =>{
            this.name = resp.data.name;
            this.studyInfo = resp.data.studyInfo;
            if(resp.data.hobbies!=null){
                this.hobbies = resp.data.hobbies;
            }
            if(resp.data.abilities!=null){
                this.abilities = resp.data.abilities;
            }
            if(resp.data.certificates!=null){
                this.certificates = resp.data.certificates;
            }
        }) 
    },
    computed:{
        isSeller(){
            return this.store.getters.getIsSeller;
        }
    },
    components:{
        InputText,
        Button,
    },
    methods:{
        removeHobby(h){
            this.hobbies = this.hobbies.filter(hobby => hobby != h)
        },
        removeCertificate(c){
            this.certificates = this.certificates.filter(certificate => certificate != c)
        },
        removeAbility(a){
            this.abilities = this.abilities.filter(ability => ability != a)
        },
        submitHandler(){
            this.$axios.put("/users/fillProfile",{
                id: this.$route.params.id,
                name : this.name,
                studyInfo : this.studyInfo,
                certificates : this.certificates,
                hobbies : this.hobbies,
                abilities : this.abilities,
            })
            this.$router.push({name:"profile", params:{userId:this.store.getters.getUserId}})
        },
        addCertificate(){
            this.certificates.push(this.currCertificate);
            this.currCertificate = "";
        },
        addSkill(){
            this.abilities.push(this.currAbility);
            this.currAbility = "";
        },
        addHobby(){
            this.hobbies.push(this.currHobby);
            this.currHobby = "";
        }

    }
    }
</script>

<style>
.profile-form{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
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