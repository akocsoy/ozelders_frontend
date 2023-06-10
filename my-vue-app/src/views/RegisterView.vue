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
export default {
    data(){
        return{
            email : ref(''),
            name: ref(''),
            surname: ref(''),
            password: ref(''),
            passwordCheck: ref(''),
            isRegistering:ref(null)

        }
    },
    methods:{
        register(){
            this.isRegistering = true;
            this.$axios.post("/users", {
                logStatus: 0,
                name: this.name+ " "+ this.surname,
                email:this.email,
                password: this.password
            }).then(()=>{
            this.$router.push("/login");
            })
        }
    },
    computed:{
        outlineValidation(){
            if(this.password == this.passwordCheck){
                return true
            }else{
                return false
            }
        }
    }
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
                        <span class="text-600 font-medium">Devam etmek için lütfen kayıt olun</span>
                    </div>

                    <div>
                        <label for="name" class="block text-900 text-xl font-medium mb-2">İsim</label>
                        <InputText id="name" type="text" placeholder="İsim" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="name" required="Bu alan boş bırakılamaz"/>

                        <label for="surname" class="block text-900 text-xl font-medium mb-2">Soyisim</label>
                        <InputText id="surname" type="text" placeholder="Soyisim" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="surname" />

                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email adresi" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" required="Bu alan boş bırakılamaz"/>

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Şifre</label>
                        <Password id="password1" v-model="password" placeholder="Şifre" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem" required="Bu alan boş bırakılamaz"></Password>

                        <label for="password2" class="block text-900 font-medium text-xl mb-2">Şifreyi Tekrarlayınız</label>
                        <Password id="password2" v-model="passwordCheck" placeholder="Şifre" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Beni Hatırla</label>
                            </div>
                        </div>

                        <h4 v-if="!outlineValidation" style="color:red">Şifreler Uyuşmuyor</h4>
                        <div  v-if="isRegistering" class="spinner-container">
                            <i class="pi pi-spin pi-spinner spinner" style="font-size: large; margin-bottom: 5px;"></i>
                            <p>Kayıt Yapılıyor ...</p>
                        </div>
                        <Button label="Kayıt ol" class="w-full p-3 text-xl" @click="register()" ></Button>
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
</style>