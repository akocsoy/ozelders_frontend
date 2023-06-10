<script>
import PanelMenu from 'primevue/panelmenu';
import { useStore } from 'vuex';
export default{
    data(){
        return{
            store:useStore(),
            priceDesc:false,
            starDesc:false,
            model: [{ 
                label: 'Kategoriler', 
                icon: 'pi pi-fw pi-book',
                class:'mt-5 mb-2',
                items:[
                    {label:" matematik ", command:()=>{this.onMenuItemClick(1)}},
                    {label:" fizik ", command:()=>{this.onMenuItemClick(2)}},
                    {label:" kimya ", command:()=>{this.onMenuItemClick(3)}},
                    {label:" biyoloji ", command:()=>{this.onMenuItemClick(4)}},
                    {label:" türkçe ", command:()=>{this.onMenuItemClick(5)}},
                    {label:" sosyal ", command:()=>{this.onMenuItemClick(6)}},
                    {label:" ingilizce ", command:()=>{this.onMenuItemClick(7)}},
                ]
            },
            { 
                label: 'Ayarlar', 
                icon: 'pi pi-fw pi-cog',
                items:[
                    {
                        label: "İlan Oluştur",  
                        command:()=> {this.$router.push("/addAdvert")},
                        visible:()=> this.isVisible
                    },
                    {
                        label: "Eğitmen Ol",
                        command:()=>{this.$router.push("/be-seller")},
                        visible:()=> !this.isVisible
                    },
                    {
                        label: "Başvurularım",
                        command:()=>{this.$router.push("/applied-adverts")}
                    },
                    {
                        label: "İlanlarım",
                        command:()=>{this.$router.push("/my-adverts")},
                        visible:()=> this.isVisible
                    }
                ]
            },
            {
                label:'Filtrele',
                icon: 'pi pi-fw pi-sort-alt',
                items:[
                    {
                        label:"Fiyata göre sırala",
                        icon:"pi pi-fw pi-sort-amount-down",
                        command:()=>{this.sortByPrice()}
                    },
                    {
                        label:"Kullanıcı puanına göre sırala",
                        icon:"pi pi-fw pi-sort-amount-down",
                        command:()=>{this.sortByStars()}
                    }
                ]
            },
            {
                label:'Çıkış Yap',
                icon: 'pi pi-fw pi-sign-out',
                class: "bottom-item",
                command:()=>{this.signOut()}
            }
        ]
        }
    },
    mounted(){
        console.log(this.model)
    },
    methods:{
        onMenuItemClick(categoryId){
            if(this.store.getters.getCategoryId != categoryId ){
                this.store.dispatch('updateCategoryId',categoryId)
            }else{
                this.store.dispatch('updateCategoryId',0)
            }
            this.$router.push("/")
        },
        signOut(){
            this.$axios.put('/users/logout',{
                id:this.store.getters.getUserId
            }).then(()=>{
                this.store.dispatch('signOut')
                this.$router.push('/login')
            })
        },
        sortByPrice(){
            if(this.priceDesc){
                this.store.dispatch('updatePriceSort', "DESC")
                this.model[2].items[0].icon = "pi pi-fw pi-sort-amount-down"
                this.priceDesc = false;
            }else{
                this.store.dispatch('updatePriceSort', "INC")
                this.model[2].items[0].icon = "pi pi-fw pi-sort-amount-up"
                this.priceDesc = true;
            }
            
        },
        sortByStars(){
            if(this.starDesc){
                this.store.dispatch('updateStarsSort', "DESC")
                this.model[2].items[1].icon = "pi pi-fw pi-sort-amount-down"
                this.starDesc = false;
            }else{
                this.store.dispatch('updateStarsSort', "INC")
                this.model[2].items[1].icon = "pi pi-fw pi-sort-amount-up"
                this.starDesc = true;
            }
            
        }
    },
    components:{
        PanelMenu
    },
    computed:{
        getSellerStatus(){
            return this.store.getters.getIsSeller
        },
        getLabel(){
            if(this.getSellerStatus == 1){
                return "İlan Ekle"
            }else{
                return "Eğitimci Ol"
            }
        },
        isVisible(){
            if(this.getSellerStatus == 1){
                return true
            }else{
                return false
            }
        },
        getStarsIcon(){
            if(this.starDesc){
                return "pi pi-fw pi-sort-amount-down"
            }
            else{
                return "pi pi-fw pi-sort-amount-up"
            }
        },
        getPriceIcon(){
            if(this.priceDesc){
                return "pi pi-fw pi-sort-amount-down"
            }
            else{
                return "pi pi-fw pi-sort-amount-up"
            }
        }
    }
}
</script>

<template>
    <h3 class="mt-3 font-italic">Menü</h3>
    <ul class="layout-menu">
        <PanelMenu :model = "model"></PanelMenu>
    </ul>
</template>
<style>
    .bottom-item{
        position:absolute;
        bottom: 40px;
        width: 85%;
    }
</style>
<style lang="scss" scoped>
    .menu-header{
        margin-top:10px;
        margin-bottom:20px;
    }
</style>
