<template>
  <h1 class="mb-5">Eğitimlerin</h1>
  <h5 v-if="adverts.length == 0">Henüz eğitimin yok <a href="#/addAdvert">hemen oluştur</a></h5>
    <div v-for="ad in getAds" :key="ad.id" style="display: flex; flex-direction: column; background-color: rgb(236, 236, 236); border-radius: 10px; padding: 10px; margin-bottom: 10px; width: 60%; max-height: fit-content;">
        <div class="ad-content">
            <h5>{{ ad.description }}</h5>
            <p style="font-size: smaller;"> {{ ad.detailedDescription }} </p>

            <div class="options" style="display: flex; float: right;">
                <Button @click="getApplicants(ad.applicants)" label = "Başvuruları Görüntüle" severity="info" text rounded size="small" style="margin-left: auto;"/>
                <Button @click="confAd(ad)" label="İlanı Düzenle" severity="warning" text rounded size="small" style="margin-right: auto;"/>
                <Button @click="openVerification(ad.id)" label="İlanı Sil" severity="danger" text rounded size="small" aria-label="Cancel" style="margin-left: auto;"/>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visibleApplicants" modal header=" Bu İlana Başvuranlar">
        <div class="applicant-info" v-for="appl in applicants" :key="appl">
            <div class="name mb-2 flex">
                <p class="font-bold">Kullanıcı ismi: </p> <p class="ml-1">{{ appl.name }}</p> <p class="font-light text-sm ml-2 profile-link mt-1" @click="goToProfile(appl.id)">profile git</p>
            </div>
            <div class="email mb-2 flex">
                <p class="font-bold">Kullanıcı emaili: </p> <p class="ml-1">{{ appl.email }}</p>
            </div>
            <div class="study mb-2 flex">
                <p class="font-bold">Kullanıcı Öğrenim bilgileri: </p> <p class="ml-1">{{ appl.studyInfo }}</p>
            </div>  
        </div>
    </Dialog>
    <Dialog v-model:visible="visibleConfirm" modal >
        <div class="modalContainer" style="display: flex; flex-direction: column; justify-content: center;">
            <p>İlanı silmek istediğinizden emin misiniz ?</p>
            <div class="options" style="display: flex; justify-content: space-between;">
                <Button severity="danger" @click="removeApplied(selectedAd)" >Evet</Button>
                <Button severity="success" @click="()=>{visibleConfirm = false, selectedAd = null}">Hayır</Button>
            </div>
        </div> 
    </Dialog>
    <Dialog v-model:visible="visibleUpdate" modal>
        <div class="update-container">
            <label for="title" class="block text-900 text-xl font-medium mb-2">İlan Başlığı</label>
            <InputText id="title" v-model="title" type="text" placeholder="Başlık giriniz" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>
        
            <label for="description" class="block text-900 text-xl font-medium mb-2">İlan Açıklaması</label>
            <TextArea id="description" v-model="description" type="text-box" :disabled="isApplied(selectedAd)" placeholder="Açıklama giriniz" class="w-full md:w-30rem mb-5" style="padding: 1rem" rows="6" required="Bu alan boş bırakılamaz"/>

            <label for="category" class="block text-900 text-xl font-medium mb-2">Ders Kategorisi</label>
            <DropDown id="category" v-model="categoryValue" :options="categories" :disabled="isApplied(selectedAd)" class="w-full md:w-30rem mb-5" placeholder="Lütfen Seçiniz" required="Bu alan boş bırakılamaz"/>
        
            <label for="price" class="block text-900 text-xl font-medium mb-2">Saatlik Fiyat</label>
            <InputNumber id="price" v-model="price" class="w-full md:w-30rem mb-5" :disabled="isApplied(selectedAd)" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

            <label for="weeklyHours" class="block text-900 text-xl font-medium mb-2">Haftalık Ders Saati</label>
            <InputNumber id="weeklyHours" v-model="weeklyHours" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

            <label for="startDate" class="block text-900 text-xl font-medium mb-2">Ders Başlangıç Tarihi</label>
            <Calendar id="startDate" v-model="startDate" dateFormat="dd/mm/yy" :disabled="isApplied(selectedAd)" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>
        
            <label for="duration" class="block text-900 text-xl font-medium mb-2">İlan Süresi</label>
            <DropDown id="duration" v-model="duration" :disabled="isApplied(selectedAd)" placeholder="İlan süresi seçiniz ( gün sayısı )" class="w-full md:w-30rem mb-5" :options="durations" required="Bu alan boş bırakılamaz"/>
        
            <label for="quota" class="block text-900 text-xl font-medium mb-2">Kontenjan</label>
            <InputNumber id="quota" v-model="quota" inputId="integeronly" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

            <label for="platform" class="block text-900 text-xl font-medium mb-2">Ders Platformu</label>
            <DropDown id="platform" v-model="platformValue" :options="platforms" class="w-full md:w-30rem mb-5" placeholder="Lütfen Seçiniz" required="Bu alan boş bırakılamaz" />

            <label for="platformCode" class="block text-900 text-xl font-medium mb-2" v-if="platformValue != '' && platformValue != null">{{getCodeLabel}}</label>
            <InputText id="platformCode" v-model="platformCode" type="text" :placeholder="getCode" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz" v-if="platformValue != '' && platformValue != null"/>
        
            <Button class="mt-3" type="submit" @click="handleSubmit" style="width:30%; margin-left: auto;">İlanı Tamamla</Button>
        </div>
    </Dialog>
</template>

<script>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import TextArea from 'primevue/textarea'
import DropDown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import { useStore } from 'vuex'
import InputNumber from 'primevue/inputnumber'
export default {
    data(){
        return{
            applicants:[],
            visibleApplicants :false,
            minDate:"",
            maxDate:"",
            platformValue:"",
            platformCode:"",
            title:"",
            description:"",
            categoryValue:"",
            price:0,
            duration:0,
            quota:0,
            store : useStore(),
            startDate : new Date(),
            weeklyHours: 0,
            durations:[
                3,7,14,30
            ],
            platforms:[
                "Zoom",
                "Microsoft Teams",
                "Discord",
            ],
            categories:[
                "Matematik",
                "Fizik",
                "Kimya",
                "Biyoloji",
                "Türkçe",
                "Sosyal",
                "İngilizce"
            ],
            selectedAd: 0,
            visibleConfirm:false,
            visibleUpdate:false,
            adverts:[]
        }
    },
    created(){
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = month === 0 ? 11 : month - 1;
        let prevYear = prevMonth === 11 ? year - 1 : year;
        let nextMonth = month === 11 ? 0 : month + 1;
        let nextYear = nextMonth === 0 ? year + 1 : year;

        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);
    },
    components:{
        Dialog,
        Button,
        TextArea,
        DropDown,
        InputNumber,
        InputText,
        Calendar
    },
    mounted(){
        this.$axios.get("/adverts/"+this.store.getters.getUserId).then((resp)=>{
            this.adverts = resp.data;
            console.log(this.adverts)
        })

    },
    methods:{
        openVerification(id){
            this.selectedAd = id
            this.visibleConfirm = true
        },
        isApplied(id){
            if(this.adverts.filter(ad => ad.id == id)[0].applicants != null && this.adverts.filter(ad => ad.id == id)[0].applicants.length != 0){
                return true
            }else{
                return false
            }
        },
        getApplicants(ids){
            if(ids != null && ids != []){
                for(let id = 0; id<ids.length ; id++){
                this.$axios.get("/users/getById/"+ids[id]).then(resp =>{
                    this.applicants.push(resp.data)
                }).finally(()=>{
                    if(ids.length == 0){
                        alert("Bu ilana başvuran olmamıştır")
                    }else{
                        this.visibleApplicants = true
                    }
                })
            } 
            }else{
                alert("Bu ilana başvuran olmamıştır")
            }
            
        },
        goToProfile(id){
            this.$router.push({name:"profile",params:{userId: id}})
        },
        removeApplied(id){
            this.$axios.delete("/adverts/"+id);
            this.adverts=this.adverts.filter(ad => ad.id != id)
            this.visibleConfirm = false;
            this.selectedAd = 0;
        },
        confAd(ad){
            console.log(ad);
            this.selectedAd = ad.id
            this.platformValue = ad.platform
            this.platformCode = ad.platformCode
            this.title = ad.description
            this.description = ad.detailedDescription
            this.categoryValue = ad.categoryName
            this.price = ad.price
            this.duration = ad.duration
            this.quota = ad.quota
            this.startDate = ad.startDate
            this.weeklyHours = ad.weeklyHours
            this.visibleUpdate = true
        },
        handleSubmit(){
            this.$axios.put("/adverts/update",{
                id: this.selectedAd,
                userId: this.store.getters.getUserId,
                description: this.title,
                detailedDescription: this.description,
                duration: this.duration,
                price: this.price,
                startDate: this.startDate,
                weeklyHours: this.weeklyHours,
                publishDate: new Date(),
                categoryId: this.getCategoryId,
                quota: this.quota,
                platform: this.platformValue,
                platformCode: this.platformCode,
                applicants: this.applicants,
            }).then(()=>{
                alert("ilan başarıyla düzenlendi")
                this.visibleUpdate = false;
            })
        },
    },
    computed:{
        getCode(){
            switch(this.platformValue){
                case "Discord":
                    return "Discord davetiye linkini giriniz";
                case "Microsoft Teams":
                    return "Teams grup kodunu giriniz";
                case "Zoom":
                    return "zoom davet kodunu giriniz";
            }
        },
        getCodeLabel(){
            switch(this.platformValue){
                case "Discord":
                    return "Discord davetiye linki";
                case "Microsoft Teams":
                    return "Teams grup kodu";
                case "Zoom":
                    return "Zoom davet kodu";
            }
        },
        getCategoryId(){
            switch(this.categoryValue){
                case "Matematik": 
                    return 1;
                case "Fizik":
                    return 2;
                case "Kimya":
                    return 3;
                case "Biyoloji":
                    return 4;
                case "Türkçe":
                    return 5;
                case "Sosyal":
                    return 6;
                case "İngilizce":
                    return 7;
            }
        },
        getAds(){
            return this.adverts
        },
        
    }
}
</script>

<style>
    .profile-link{
        color: rgb(187, 186, 186);
    }
    .profile-link:hover{
        cursor: pointer;
        color: rgb(104, 104, 187);
    }
    .applicant-info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        border: 1px solid darkcyan;
        margin-bottom: 5px;
        padding: 10px;
        border-radius: 5px;
    }
    .update-container{
        display: flex;
        flex-direction: column;
    }
</style>