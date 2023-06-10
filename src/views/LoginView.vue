<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';


const { layoutConfig } = useLayout();



const checked = ref(false);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>
<script>
import { useStore } from 'vuex';

export default {
    data(){
        return{
            email : ref(''),
            password : ref(''),
            store : useStore(),
            isLogged: false,
        }
    },
    computed:{
        emptyField(){
            if(this.email == "" || this.password == ""){
                return true;
            }else{
                return false;
            }
        }
    },  
    methods:{
        login(){
            this.isLogged = true;
            this.$axios.put("/users/login", {
                email: this.email,
                password: this.password
            }).then((resp)=>{
            console.log(resp.data);
            this.store.dispatch('updateName', resp.data.name);
            this.store.dispatch('updateEmail', resp.data.email);
            this.store.dispatch('updateUserId', resp.data.id)
            this.store.dispatch('updateIsSeller', resp.data.isSeller);
            this.$router.push("/");
    }).catch(e =>{
        console.log(e);
        alert(e.response.data.message)
        this.isLogged= false;
        
    })
}
    },
}
</script>

<template>
    
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">ozelders.com'a Hoşgeldiniz</div>
                        <span class="text-600 font-medium">Devam etmek için lütfen giriş yapın</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email adresi" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" required="Bu alan boş bırakılamaz"/>

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Şifre</label>
                        <Password id="password1" :feedback="false" v-model="password" placeholder="Şifre" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" @keypress.enter="login()" required="Bu alan boş bırakılamaz"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Beni Hatırla</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Şifremi Unuttum</a>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)" @click="this.$router.push({name:'register'})">Hesabım Yok</a>
                        </div>
                        <div  v-show="isLogged" class="spinner-container">
                            <i class="pi pi-spin pi-spinner spinner" style="font-size: large; margin-bottom: 5px;"></i>
                            <p>Giriş Yapılıyor ...</p>
                        </div>
                        
                        <Button :disabled="emptyField" label="Giriş yap" class="w-full p-3 text-xl" @click="login()"></Button>
                        <p v-if="emptyField" style="color: red;"> Lütfen tüm alanları doldurun </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
.spinner-container{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: center;
    width: 100%;
    height: fit-content;
    margin-bottom: 10px;
    margin-top: 10px;
}

</style>
