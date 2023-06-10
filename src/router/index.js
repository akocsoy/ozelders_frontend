import { createRouter, createWebHashHistory } from "vue-router";
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes:[
        {
            path:"/",
            component: AppLayout,
            
            children:[
                {
                    path:"/",
                    name:"home",
                    component:() =>  import("@/views/HomeView.vue"),
                },
                {
                    path:"/profile/:userId",
                    name:"profile",
                    component: ()=> import("@/views/ProfileView.vue")
                },
                {
                    path:"/advert/:advertId",
                    name:"advert",
                    component: () => import("@/views/AdvertView.vue")
                },
                {
                    path:"/addAdvert",
                    name:"addAdvert",
                    component:()=> import("@/views/AdvertAddView.vue")
                },
                {
                    path:"/fill-profile/:id",
                    name:"fillProfilePage",
                    component:()=> import("@/views/FillProfile.vue")
                },
                {
                    path: "/applied-adverts",
                    name:"applied",
                    component:()=>import("@/views/AppliedAdvertView.vue")
                },
                {
                    path:"/be-seller",
                    name:"beSeller",
                    component:()=> import("@/views/BeSellerView.vue")
                },
                {
                    path:"/my-adverts",
                    name:"myAdverts",
                    component:()=> import("@/views/UserAdvertsView.vue")
                }
            ]
        },
        {
            path:"/login",
            name:"login",
            component: ()=> import("@/views/LoginView.vue")
        },
        {
            path:"/register",
            name:"register",
            component: ()=> import("@/views/RegisterView.vue")
        },
        
        
    ]
});
export default router;