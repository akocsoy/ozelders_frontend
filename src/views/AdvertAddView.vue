<template>
    <div class="advert-add">
        <h1 class="mb-7">İlan Oluşturma Formu</h1>
        <label for="title" class="block text-900 text-xl font-medium mb-2">İlan Başlığı</label>
        <InputText id="title" v-model="title" type="text" placeholder="Başlık giriniz" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>
        
        <label for="description" class="block text-900 text-xl font-medium mb-2">İlan Açıklaması</label>
        <TextArea id="description" v-model="description" type="text-box" placeholder="Açıklama giriniz" class="w-full md:w-30rem mb-5" style="padding: 1rem" rows="6" required="Bu alan boş bırakılamaz"/>

        <label for="category" class="block text-900 text-xl font-medium mb-2">Ders Kategorisi</label>
        <DropDown id="category" v-model="categoryValue" :options="categories" class="w-full md:w-30rem mb-5" placeholder="Lütfen Seçiniz" required="Bu alan boş bırakılamaz"/>
        
        <label for="price" class="block text-900 text-xl font-medium mb-2">Saatlik Fiyat</label>
        <InputNumber id="price" v-model="price" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

        <label for="weeklyHours" class="block text-900 text-xl font-medium mb-2">Haftalık Ders Saati</label>
        <InputNumber id="weeklyHours" v-model="weeklyHours" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

        <label for="startDate" class="block text-900 text-xl font-medium mb-2">Ders Başlangıç Tarihi</label>
        <Calendar id="startDate" v-model="startDate" dateFormat="dd/mm/yy" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>
        
        <label for="duration" class="block text-900 text-xl font-medium mb-2">İlan Süresi</label>
        <DropDown id="duration" v-model="duration" placeholder="İlan süresi seçiniz ( gün sayısı )" class="w-full md:w-30rem mb-5" :options="durations" required="Bu alan boş bırakılamaz"/>
        
        <label for="quota" class="block text-900 text-xl font-medium mb-2">Kontenjan</label>
        <InputNumber id="quota" v-model="quota" inputId="integeronly" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz"/>

        <label for="platform" class="block text-900 text-xl font-medium mb-2">Ders Platformu</label>
        <DropDown id="platform" v-model="platformValue" :options="platforms" class="w-full md:w-30rem mb-5" placeholder="Lütfen Seçiniz" required="Bu alan boş bırakılamaz" />

        <label for="platformCode" class="block text-900 text-xl font-medium mb-2" v-if="platformValue != '' && platformValue != null">{{getCodeLabel}}</label>
        <InputText id="platformCode" v-model="platformCode" type="text" :placeholder="getCode" class="w-full md:w-30rem mb-5" style="padding: 1rem" required="Bu alan boş bırakılamaz" v-if="platformValue != '' && platformValue != null"/>
        
        <p v-if="emptyField" style="color: red;"> Lütfen tüm alanları doldurun </p>
        <Button :disabled="emptyField" type="submit" @click="handleSubmit">İlanı Oluştur</Button>

    </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import TextArea from 'primevue/textarea'
import DropDown from 'primevue/dropdown';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber'
import { useStore } from 'vuex';
import Calendar from "primevue/calendar";
export default {
    data(){
        return{
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
            ]
        }
    },
    methods:{
        handleSubmit(){
            this.$axios.post("/adverts",{
                userId: this.store.getters.getUserId,
                description: this.title,
                detailedDescription: this.description,
                duration: this.duration,
                price: this.price,
                weeklyHours: this.weeklyHours,
                startDate: this.startDate,
                publishDate: new Date(),
                categoryId: this.getCategoryId,
                quota: this.quota,
                platform: this.platformValue,
                platformCode: this.platformCode,
                applicants: [],
            }).then(()=>{
                this.$router.push({name:"home"});
            })
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
    computed:{
        emptyField(){
            if(this.platformValue == "" || this.title == "" || this.description == "" || this.categoryValue == "" || this.price == 0 || this.duration == 0 || this.quota == 0 || this.startDate == ""|| this.weeklyHours == 0 || this.platformCode == ""){
                return true;
            } else{
                return false;
            }
        },
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
        }
    },
    components:{
        InputText,
        DropDown,
        Button,
        TextArea,
        InputNumber,
        Calendar,
    }
}
</script>

<style>
    .advert-add{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
    }
</style>