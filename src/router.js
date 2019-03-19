import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import RegisterHistory from "./views/RegisterHistory";
import Auditing from "./views/Auditing";
import Upgrade from "./views/Upgrade";
import History from "./views/UpgradeHistory";
import Setting from "./views/Setting";
import Team from "./views/Team";
import Password from "./views/Password";
import Phone from "./views/Phone";
import Face from "./views/Face";
import Qrcode from "./views/Qrcode";
import Help from "./views/Help";
import Notice from "./views/Notice";
import Detail from "./views/Detail";
import Feedback from "./views/Feedback";
import Reglink from "./views/Reglink";
import Qreg from "./views/Qreg";
import Reset from "./views/Reset";
import Download from "./views/Download";

Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            meta:{index:0},//meta对象的index用来定义当前路由的层级,由小到大,由低到高,top控制顶部header是否显示
            component:Home
        },
        {
            path: "/login",
            name: "login",
            meta:{index:1},
            component: Login
        },
        {
            path: "/register",
            name: "register",
            meta:{index:1},
            component: Register
        },
        {
            path: "/regHistory",
            name: "regHistory",
            meta:{index:2},
            component: RegisterHistory
        },
        {
            path: "/auditing",
            name: "auditing",
            meta:{index:1},
            component: Auditing
        },
        {
            path: "/upgrade",
            name: "upgrade",
            meta:{index:1},
            component: Upgrade
        },
        {
            path: "/history",
            name: "history",
            meta:{index:2},
            component: History
        },
        {
            path: "/team",
            name: "team",
            meta:{index:1},
            component: Team
        },
        {
            path: "/setting",
            name: "setting",
            meta:{index:1},
            component: Setting
        },
        {
            path: "/password",
            name: "password",
            meta:{index:2},
            component: Password
        },
        {
            path: "/phone",
            name: "phone",
            meta:{index:2},
            component: Phone
        },
        {
            path: "/face",
            name: "face",
            meta:{index:2},
            component: Face
        },
        {
            path: "/qrcode",
            name: "qrcode",
            meta:{index:2},
            component: Qrcode
        },
        {
            path: "/help",
            name: "help",
            meta:{index:1},
            component: Help
        },
        {
            path: "/notice",
            name: "notice",
            meta:{index:1},
            component: Notice
        },
        {
            path: "/detail/:id",
            name: "detail",
            meta:{index:2},
            component: Detail
        },
        {
            path: "/feedback",
            name: "feedback",
            meta:{index:2},
            component: Feedback
        },
        {
            path: "/reglink",
            name: "reglink",
            meta:{index:2},
            component: Reglink
        },
        {
            path: "/reg",
            name: "reg",
            meta:{index:2},
            component: Qreg
        },
        {
            path: "/reset",
            name: "reset",
            meta:{index:1},
            component: Reset
        },
        {
            path: "/download",
            name: "download",
            meta:{index:2},
            component: Download
        },
    ]
});
