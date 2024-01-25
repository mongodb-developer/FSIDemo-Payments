(function(){"use strict";var e={7136:function(e,t,a){var s=a(9242),n=a(3396);const r={class:"main-container"};function o(e,t,a,s,o,i){const c=(0,n.up)("MainHeader"),u=(0,n.up)("router-view");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(c,{user:o.user},null,8,["user"]),(0,n._)("div",r,[(0,n.Wm)(u,{onSetUser:i.setUser},null,8,["onSetUser"])])],64)}a(560);var i=a(7139),c=a.p+"img/happy_leafy.8f0c17d0.png";const u=e=>((0,n.dD)("data-v-13eb64ee"),e=e(),(0,n.Cn)(),e),l={class:"main-header"},d=u((()=>(0,n._)("img",{src:c,alt:"MongoDB Logo"},null,-1))),h=u((()=>(0,n._)("h2",{class:"heading"},"Payments Demo",-1))),m=[d,h],p={class:"nav"},f=u((()=>(0,n._)("div",{class:"menu-btn"},[(0,n._)("i",{class:"fas fa-bars fa-2x"})],-1))),g={key:2,class:"notification-badge"},y=u((()=>(0,n._)("i",{class:"fas fa-bell fa-2x"},null,-1))),_={key:0,class:"notification"};function w(e,t,a,s,r,o){const c=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("div",l,[(0,n._)("div",{class:"logo",onClick:t[0]||(t[0]=(...e)=>o.goHome&&o.goHome(...e))},m),(0,n._)("div",p,[f,a.user?((0,n.wg)(),(0,n.j4)(c,{key:0,to:{name:"account",params:{id:a.user._id}}},{default:(0,n.w5)((()=>[(0,n.Uk)("My Accounts")])),_:1},8,["to"])):(0,n.kq)("",!0),(0,n.Uk)(" | "),a.user?((0,n.wg)(),(0,n.j4)(c,{key:1,to:{name:"user",query:{userId:a.user._id,username:a.user.username,email:a.user.email}}},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(a.user.username),1)])),_:1},8,["to"])):(0,n.kq)("",!0),a.user?((0,n.wg)(),(0,n.iD)("div",g,[y,(0,n._)("span",{onClick:t[1]||(t[1]=e=>r.showNotif=!r.showNotif),class:"badge"},(0,i.zw)(r.notifications.length),1),r.showNotif?((0,n.wg)(),(0,n.iD)("div",_,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(r.notifications,(e=>((0,n.wg)(),(0,n.iD)("div",{key:e._id},[(0,n._)("p",null,(0,i.zw)((new Date).toString("DD-MM-YYYY"))+" - "+(0,i.zw)(e.data),1)])))),128)),(0,n._)("button",{onClick:t[2]||(t[2]=(...e)=>o.clearNotifications&&o.clearNotifications(...e))},"Clear")])):(0,n.kq)("",!0)])):(0,n.kq)("",!0)])])}var v=a(4488);const k=(0,v.io)("http://localhost:3030");var b=k,U={name:"MainHeader",props:{user:Object},data(){return{notifications:[],showNotif:!1}},mounted(){this.setupSocket()},watch:{user(e,t){e?._id!==t?._id&&this.setupSocket()}},methods:{setupSocket(){this.user?._id&&(console.log("Setting socket user:",this.user._id),b.emit("set-user-socket",this.user._id),b.off("add-notification",this.handleNotification),b.on("add-notification",this.handleNotification))},goHome(){this.$router.push({name:"home",params:{userId:this.user._id}})},clearNotifications(){this.notifications=[],this.showNotif=!1},handleNotification(e){console.log("Received notification for current user:",e),this.notifications.push(e)}},beforeUnmount(){b.off("add-notification",this.handleNotification)}},D=a(89);const I=(0,D.Z)(U,[["render",w],["__scopeId","data-v-13eb64ee"]]);var A=I,T={name:"App",components:{MainHeader:A},mounted(){console.log("mounted app"),this.user||this.$router.push({name:"login"})},data(){return{user:null}},methods:{setUser(e){console.log("setUser",e),this.user=e}}};const P=(0,D.Z)(T,[["render",o]]);var z=P,$=a(2483);const N=e=>((0,n.dD)("data-v-e8f2b152"),e=e(),(0,n.Cn)(),e),C={class:"main-home"},R={class:"my-accounts"},S=N((()=>(0,n._)("h3",null,"My Accounts",-1))),q={class:"account-list"},x={key:0},H={class:"account-details"},M=N((()=>(0,n._)("b",null,"Account Type",-1))),Z=N((()=>(0,n._)("p",null,"Limitations: ",-1))),O=N((()=>(0,n._)("p",null," Go to account ",-1))),L=["onClick"],B={class:"my-latest-trx"},j=N((()=>(0,n._)("h3",null,"My Latest Transactions",-1))),Y={class:"transaction-list"},V={key:0},K={class:"transaction-details"},W=N((()=>(0,n._)("b",null,"Amount",-1))),Q=N((()=>(0,n._)("b",null,"@",-1)));function E(e,t,a,s,r,o){const c=(0,n.up)("router-link"),u=(0,n.up)("payeePicker"),l=(0,n.up)("AddAccount");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n._)("div",C,[(0,n._)("button",{onClick:t[0]||(t[0]=(...e)=>o.refreshPage&&o.refreshPage(...e))},"Refresh")]),(0,n._)("div",R,[S,(0,n._)("div",q,[0===this.currentUser?.linkedAccounts.length?((0,n.wg)(),(0,n.iD)("div",x,"No accounts")):(0,n.kq)("",!0),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(this.currentUser.linkedAccounts,(e=>((0,n.wg)(),(0,n.iD)("div",{key:e.accountId},[(0,n._)("details",H,[(0,n._)("summary",null,[M,(0,n.Uk)(": "+(0,i.zw)(e.accountType),1)]),Z,((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(Object.keys(e.limitations),(t=>((0,n.wg)(),(0,n.iD)("div",{key:t},(0,i.zw)(t)+" : "+(0,i.zw)(e.limitations[t]),1)))),128)),(0,n.Wm)(c,{to:{name:"account",params:{id:a.userId}}},{default:(0,n.w5)((()=>[O])),_:1},8,["to"]),(0,n._)("button",{onClick:t=>o.makePayment(e)},"Make Payment",8,L),(0,n.Wm)(u,{user:this.currentUser,onSelectionChanged:o.payeeSelected},null,8,["user","onSelectionChanged"])])])))),128))]),(0,n._)("button",{onClick:t[1]||(t[1]=(...e)=>o.addAccounts&&o.addAccounts(...e))},(0,i.zw)(r.isSetAccountDetails?"Close":"Add Account"),1),r.isSetAccountDetails?((0,n.wg)(),(0,n.j4)(l,{key:0,user:this.currentUser,onRefreshUser:o.refreshUser},null,8,["user","onRefreshUser"])):(0,n.kq)("",!0)]),(0,n._)("div",B,[j,(0,n._)("div",Y,[0===this.currentUser?.recentTransactions.length?((0,n.wg)(),(0,n.iD)("div",V,"No recent transactions")):(0,n.kq)("",!0),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(this.currentUser.recentTransactions,(e=>((0,n.wg)(),(0,n.iD)("div",{key:e._id},[(0,n._)("details",K,[(0,n._)("summary",null,[(0,n.Uk)((0,i.zw)("outgoing"===e.type?"📤":"📥")+" |",1),W,(0,n.Uk)(" : "+(0,i.zw)(e.amount)+"$ | ",1),Q,(0,n.Uk)(" "+(0,i.zw)(new Date(e.date)),1)]),(0,n._)("p",null,[(0,n.Uk)(" Trx Id : "),(0,n.Wm)(c,{to:{name:"transaction",params:{id:e._id},query:{trxId:e._id}}},{default:(0,n.w5)((()=>[(0,n.Uk)((0,i.zw)(e._id),1)])),_:2},1032,["to"])]),(0,n._)("p",null,"Type : "+(0,i.zw)(e.type),1),(0,n._)("p",null,(0,i.zw)("outgoing"===e.type?`To: ${e.referenceData.receiver.name}`:`From: ${e.referenceData.sender.name}`),1),(0,n._)("p",null,"Amount: "+(0,i.zw)(e.amount),1),(0,n._)("p",null,"Status: "+(0,i.zw)(e.status),1)])])))),128))])])])}var F=a(1076);const G=e=>((0,n.dD)("data-v-1cc468f0"),e=e(),(0,n.Cn)(),e),J=G((()=>(0,n._)("label",{for:"accountType"},"Account Type",-1))),X=G((()=>(0,n._)("option",{value:"checking"},"Checking",-1))),ee=G((()=>(0,n._)("option",{value:"savings"},"Savings",-1))),te=[X,ee],ae=G((()=>(0,n._)("label",{for:"accountBalance"},"Account Balance",-1))),se={class:"random-account"},ne=G((()=>(0,n._)("label",{for:"accountNumber"},"Account Number",-1))),re=G((()=>(0,n._)("button",{type:"submit"},"Add Account",-1)));function oe(e,t,a,r,o,i){return(0,n.wg)(),(0,n.iD)("form",{onSubmit:t[4]||(t[4]=(0,s.iM)(((...e)=>i.addAccount&&i.addAccount(...e)),["prevent"]))},[J,(0,n.wy)((0,n._)("select",{id:"accountType","onUpdate:modelValue":t[0]||(t[0]=e=>o.accountType=e)},te,512),[[s.bM,o.accountType]]),ae,(0,n.wy)((0,n._)("input",{type:"number",id:"accountBalance","onUpdate:modelValue":t[1]||(t[1]=e=>o.accountBalance=e)},null,512),[[s.nr,o.accountBalance]]),(0,n._)("div",se,[ne,(0,n.wy)((0,n._)("input",{type:"text",id:"accountNumber","onUpdate:modelValue":t[2]||(t[2]=e=>o.accountNumber=e)},null,512),[[s.nr,o.accountNumber]]),(0,n._)("button",{onClick:t[3]||(t[3]=(0,s.iM)(((...e)=>i.generateRandomAccountNumber&&i.generateRandomAccountNumber(...e)),["prevent"]))},"Generate Random Account Number")]),re],32)}var ie={name:"AddAccount",props:{user:Object},data(){return{accountType:"checking",accountNumber:"",accountBalance:1e3}},methods:{generateRandomAccountNumber(){this.accountNumber=Math.floor(1e9*Math.random())},async addAccount(){try{if(console.log("Adding account:",this.user),!this.accountNumber||!this.accountType||!this.accountBalance)return void alert("Please enter a valid account details");const e=await F.Z.post("http://localhost:3030/api/account",{userId:this.user._id,username:this.user.username,accountDetails:{accountNumber:`${this.accountNumber}`,accountType:this.accountType,balance:this.accountBalance,limitations:{withdrawalLimit:1e5,transferLimit:1e3,otherLimitations:"No Limit"},securityTags:[],details:{IBAN:`IL${this.accountNumber}`}}});console.log("Account added successfully:",e.data),this.$emit("refreshUser",e.data.user)}catch(e){console.error("Account add failed:",e)}}}};const ce=(0,D.Z)(ie,[["render",oe],["__scopeId","data-v-1cc468f0"]]);var ue=ce;const le={class:"payee-picker"},de={key:0},he=["onClick"];function me(e,t,a,r,o,c){return(0,n.wg)(),(0,n.iD)("div",le,[(0,n._)("div",null,[(0,n.wy)((0,n._)("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>o.searchTerm=e),onInput:t[1]||(t[1]=(...t)=>e.debouncedSearch&&e.debouncedSearch(...t)),placeholder:"Search payees..."},null,544),[[s.nr,o.searchTerm]]),o.searchResults.length?((0,n.wg)(),(0,n.iD)("ul",de,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(o.searchResults,(e=>((0,n.wg)(),(0,n.iD)("li",{key:e._id,onClick:t=>c.selectPayee(e),class:(0,i.C_)(["payee-item",{"selected-payee":e._id===o.selectedPayee._id}])},(0,i.zw)(e.username)+" - "+(0,i.zw)(e.account),11,he)))),128))])):(0,n.kq)("",!0)])])}var pe=a(4806),fe=a.n(pe),ge={props:{user:Object},data(){return{payees:[],selectedPayee:{},searchTerm:"",searchResults:[]}},mounted(){this.getPayees()},created(){this.debouncedSearch=fe().debounce(this.searchPayee,300)},methods:{async getPayees(){try{const e=await F.Z.get("http://localhost:3030/api/account/fts/search");let t=e.data.filter((e=>e._id!==this.user._id));this.searchResults=t}catch(e){console.error("Payees failed:",e)}},selectPayee(e){this.selectedPayee=e,this.selectedPayee.userId=e.userId,this.searchTerm=e.username,this.sendPayeeToParent()},async searchPayee(){if(this.searchTerm.length>0){const e=await F.Z.get(`http://localhost:3030/api/account/fts/search?text=${this.searchTerm}`);let t=e.data.filter((e=>e._id!==this.user._id));this.searchResults=t}else this.searchResults=[]},sendPayeeToParent(){this.$emit("selection-changed",this.selectedPayee)}}};const ye=(0,D.Z)(ge,[["render",me],["__scopeId","data-v-d8232a56"]]);var _e=ye,we={name:"MainHome",props:["userId"],components:{AddAccount:ue,payeePicker:_e},emits:["setUser"],mounted(){this.refreshPage()},data(){return{isSetAccountDetails:!1,currentUser:{_id:this.userId,linkedAccounts:[],recentTransactions:[]},selectedPayee:{}}},methods:{addAccounts(){this.isSetAccountDetails=!this.isSetAccountDetails},payeeSelected(e){this.selectedPayee=e,console.log("payee selected",this.selectedPayee)},refreshUser(e){this.currentUser=e,this.isSetAccountDetails=!1},async refreshPage(){console.log("refreshing page- ",this.userId);const e=await F.Z.get(`http://localhost:3030/api/user/${this.userId}`);console.log("user fetched successfully:",e.data),this.currentUser=e.data},async makePayment(e){if(!this.selectedPayee.userId)return void alert("Please select a payee");const t=+prompt(`Please enter amount to transfer to ${this.selectedPayee.username}`);if(!t||t<0)return void alert("Please enter a valid amount");const a={accountId:e.accountId,amount:t,type:"credit",details:{description:"Payment for services",userId:this.currentUser._id},referenceData:{receiver:{userId:this.selectedPayee.userId,accountId:this.selectedPayee.accountId}}},s=await F.Z.post(`http://localhost:3030/api/transaction/${this.currentUser._id}`,a);console.log("trx added successfully:",s.data),alert("Transaction added successfully id : "+s.data._id),await this.refreshPage()}}};const ve=(0,D.Z)(we,[["render",E],["__scopeId","data-v-e8f2b152"]]);var ke=ve;const be=e=>((0,n.dD)("data-v-91e25a32"),e=e(),(0,n.Cn)(),e),Ue={class:"registration"},De=be((()=>(0,n._)("h2",null,"User Login",-1)));function Ie(e,t,a,r,o,i){return(0,n.wg)(),(0,n.iD)("div",Ue,[De,(0,n.wy)((0,n._)("input",{type:"text","onUpdate:modelValue":t[0]||(t[0]=e=>o.username=e),placeholder:"User Name"},null,512),[[s.nr,o.username]]),o.isRegister?(0,n.wy)(((0,n.wg)(),(0,n.iD)("input",{key:0,type:"email","onUpdate:modelValue":t[1]||(t[1]=e=>o.email=e),placeholder:"Email"},null,512)),[[s.nr,o.email]]):(0,n.kq)("",!0),o.isRegister?(0,n.wy)(((0,n.wg)(),(0,n.iD)("input",{key:1,type:"password","onUpdate:modelValue":t[2]||(t[2]=e=>o.password=e),placeholder:"Password",value:"email@example.com"},null,512)),[[s.nr,o.password]]):(0,n.kq)("",!0),o.isRegister?(0,n.wy)(((0,n.wg)(),(0,n.iD)("input",{key:2,type:"password","onUpdate:modelValue":t[3]||(t[3]=e=>o.password=e),placeholder:"Confirm Password"},null,512)),[[s.nr,o.password]]):(0,n.kq)("",!0),o.isRegister?((0,n.wg)(),(0,n.iD)("button",{key:3,onClick:t[4]||(t[4]=(...e)=>i.registerUser&&i.registerUser(...e))},"Submit Registeration")):(0,n.kq)("",!0),o.isRegister?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("button",{key:4,onClick:t[5]||(t[5]=(...e)=>i.loginUser&&i.loginUser(...e))},"Login")),o.isRegister?(0,n.kq)("",!0):((0,n.wg)(),(0,n.iD)("button",{key:5,onClick:t[6]||(t[6]=e=>o.isRegister=!o.isRegister)},"Register"))])}var Ae={emits:["setUser"],data(){return{username:"",email:"",password:"",isRegister:!1}},methods:{async loginUser(){try{if(!this.validateRegistration(this.username))return void alert("Please enter a valid username name");const e=await F.Z.get(`http://localhost:3030/api/user/username/${this.username}`);console.log("Login successful:",e.data),console.log("Registration successful:",e.data),console.log("Navigating with userId:",e.data._id),this.$router.push({name:"home",params:{userId:e.data._id}}),this.$emit("setUser",e.data)}catch(e){alert("User not found, please register"),console.error("Registration failed:",e)}},validateRegistration(e){return e},async registerUser(){try{if(!this.validateRegistration(this.username))return void alert("Please enter a valid username name");const e=await F.Z.post("http://localhost:3030/api/user/register",{username:this.username,email:this.email,password:this.password});this.$emit("setUser",e.data),this.$router.push({name:"home",params:{userId:e.data._id}}),console.log("Registration successful:",e.data)}catch(e){console.error("Registration failed:",e)}}}};const Te=(0,D.Z)(Ae,[["render",Ie],["__scopeId","data-v-91e25a32"]]);var Pe=Te;const ze={class:"account-container"},$e={class:"account-details"},Ne={class:"account-details-item"};function Ce(e,t,a,s,r,o){const c=(0,n.up)("router-link");return(0,n.wg)(),(0,n.iD)("div",ze,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(this.accounts,(e=>((0,n.wg)(),(0,n.iD)("div",{class:"account-header",key:e._id},[(0,n._)("h2",null,"Account Details - "+(0,i.zw)(e.accountType),1),(0,n._)("div",$e,[(0,n._)("div",Ne,[(0,n._)("p",null,"Account Number: "+(0,i.zw)(e.accountNumber),1),(0,n._)("p",null,"Account Type: "+(0,i.zw)(e.accountType),1),(0,n._)("p",null,"Balance: "+(0,i.zw)(e.balance),1),(0,n._)("p",null,"Account Holder: "+(0,i.zw)(e.user.username),1),(0,n._)("p",null,"IBAN: "+(0,i.zw)(e.encryptedDetails.IBAN),1),(0,n._)("p",null,"Withdrawal Limit: "+(0,i.zw)(e.limitations.withdrawalLimit),1),(0,n._)("p",null,"Transfer Limit: "+(0,i.zw)(e.limitations.transferLimit),1),(0,n._)("p",null,"Other Limitations: "+(0,i.zw)(e.limitations.otherLimitations),1),(0,n.Wm)(c,{to:{name:"transaction",params:{id:e._id,userId:e.userId}}},{default:(0,n.w5)((()=>[(0,n.Uk)("All Transactions")])),_:2},1032,["to"]),(0,n.Uk)(" | ")])])])))),128)),(0,n._)("button",{onClick:t[0]||(t[0]=(...e)=>o.backToHome&&o.backToHome(...e))},"Back")])}var Re={name:"MainAccount",emits:["setUser"],props:["id"],data(){return{accounts:{}}},mounted(){this.fetchAccounts()},methods:{backToHome(){this.$router.go(-1)},async fetchAccounts(){try{const e=await F.Z.get(`http://localhost:3030/api/account?userId=${this.id}`);this.accounts=e.data}catch(e){console.log(e)}}}};const Se=(0,D.Z)(Re,[["render",Ce],["__scopeId","data-v-475acd9b"]]);var qe=Se;const xe=e=>((0,n.dD)("data-v-4f12d7af"),e=e(),(0,n.Cn)(),e),He={class:"user-details"},Me=xe((()=>(0,n._)("h2",null,"User Details",-1))),Ze={class:"user-details__header"},Oe={class:"manage-button"};function Le(e,t,a,s,r,o){return(0,n.wg)(),(0,n.iD)("div",He,[Me,(0,n._)("div",Ze,[(0,n._)("div",null," Username: "+(0,i.zw)(r.user.username),1),(0,n._)("div",null,"Email : "+(0,i.zw)(r.user.email),1)]),(0,n._)("div",Oe,[(0,n._)("button",{onClick:t[0]||(t[0]=(...e)=>o.logoutUser&&o.logoutUser(...e))},"Logout"),(0,n._)("button",{onClick:t[1]||(t[1]=(...e)=>o.deleteUser&&o.deleteUser(...e))},"Delete"),(0,n._)("button",{onClick:t[2]||(t[2]=(...e)=>o.back&&o.back(...e))},"Back")])])}var Be={name:"MainUser",mounted(){console.log("mounted user",this.user)},data(){return{user:{_id:this.$route.query.userId,username:this.$route.query.username,email:this.$route.query.email}}},methods:{logoutUser(){this.$emit("setUser",null),this.$router.push({name:"login"})},async deleteUser(){const e=confirm(`Are you sure you want to delete ${this.user.username}?`);if(!e)return;const t=await F.Z.delete(`http://localhost:3030/api/user/${this.user._id}`);console.log("User deleted successfully:",t.data),this.$emit("setUser",null),this.$router.push({name:"login"})},back(){this.$router.push({name:"home",params:{userId:this.user._id}})}}};const je=(0,D.Z)(Be,[["render",Le],["__scopeId","data-v-4f12d7af"]]);var Ye=je;const Ve=e=>((0,n.dD)("data-v-ad681330"),e=e(),(0,n.Cn)(),e),Ke={class:"main-transaction-search"},We={class:"search-transaction"},Qe=Ve((()=>(0,n._)("h3",null,"Search Transactions",-1))),Ee={class:"search-transaction-text"},Fe={class:"transaction-records"},Ge=Ve((()=>(0,n._)("h3",null,"Transaction Records",-1))),Je={class:"transaction-list"},Xe={key:0},et={class:"transaction-details"},tt=Ve((()=>(0,n._)("b",null,"Amount",-1))),at=Ve((()=>(0,n._)("b",null,"@",-1))),st=Ve((()=>(0,n._)("summary",null,"Transaction steps",-1))),nt=["onClick"],rt=Ve((()=>(0,n._)("hr",null,null,-1))),ot=Ve((()=>(0,n._)("hr",null,null,-1)));function it(e,t,a,r,o,c){return(0,n.wg)(),(0,n.iD)("div",Ke,[(0,n._)("div",We,[Qe,(0,n._)("div",Ee,[(0,n.wy)((0,n._)("input",{"onUpdate:modelValue":t[0]||(t[0]=e=>o.searchQuery=e),type:"text",placeholder:"Search for transactions...",class:"search-input"},null,512),[[s.nr,o.searchQuery]]),(0,n._)("button",{onClick:t[1]||(t[1]=(...e)=>c.fetchTransactions&&c.fetchTransactions(...e)),class:"search-button"},"Search")])]),(0,n._)("div",Fe,[Ge,(0,n._)("div",Je,[0===this.currentUser.transactions.length?((0,n.wg)(),(0,n.iD)("div",Xe,"No transactions")):(0,n.kq)("",!0),((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(this.currentUser.transactions,(e=>((0,n.wg)(),(0,n.iD)("div",{key:e._id},[(0,n._)("details",et,[(0,n._)("summary",null,[(0,n.Uk)("trxId : "+(0,i.zw)(e._id)+" | "+(0,i.zw)("outgoing"===e.type?"📤":"📥")+" |",1),tt,(0,n.Uk)(" : "+(0,i.zw)(e.amount)+"$ | ",1),at,(0,n.Uk)(" "+(0,i.zw)(new Date(e.date)),1)]),(0,n._)("p",null,"Type : "+(0,i.zw)(e.type),1),(0,n._)("p",null," From: "+(0,i.zw)(e.referenceData.sender.name),1),(0,n._)("p",null," To: "+(0,i.zw)(e.referenceData.receiver.name),1),(0,n._)("p",null," Details : "+(0,i.zw)(e.details),1),(0,n._)("p",null,"Amount: "+(0,i.zw)(e.amount),1),(0,n._)("p",null,"Status: "+(0,i.zw)(e.status),1),(0,n._)("details",null,[st,((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.steps,(e=>((0,n.wg)(),(0,n.iD)("p",{key:e.api}," * "+(0,i.zw)(e.api)+" - Completed: "+(0,i.zw)(e.completed),1)))),128))])]),"completed"===e.status&&"outgoing"===e.type?((0,n.wg)(),(0,n.iD)("button",{key:0,onClick:t=>c.refund(e._id)},"Refund",8,nt)):(0,n.kq)("",!0),rt,ot])))),128))])]),(0,n._)("button",{onClick:t[2]||(t[2]=(...e)=>c.backToHome&&c.backToHome(...e))},"Back")])}var ct={name:"TransactionSearch",props:["id","userId"],emits:["setUser"],mounted(){this.$route.query.trxId?this.fetchTransactions():this.refreshPage()},data(){return{currentUser:{_id:this.id,userId:this.userId,transactions:[]},searchQuery:this.$route.query.trxId?this.$route.query.trxId:""}},methods:{async refreshPage(){try{const e=await F.Z.get(`http://localhost:3030/api/transaction?accountId=${this.currentUser._id}`);console.log("User:",e.data),this.currentUser.transactions=e.data}catch(e){console.error("User not found:",e)}},refund(e){const t=window.confirm(`Are you sure you want to refund ${e}?`);if(!t)return;const a=F.Z.put(`http://localhost:3030/api/transaction/refund/${e}`);console.log("Refund successful:",a.data)},backToHome(){this.$router.push({name:"home",params:{userId:this.currentUser.userId}})},async fetchTransactions(){try{const e=await F.Z.get(`http://localhost:3030/api/transaction/${this.searchQuery}`);console.log("Transactions:",e.data),this.currentUser.transactions=[e.data]}catch(e){console.error("Transactions not found:",e)}}}};const ut=(0,D.Z)(ct,[["render",it],["__scopeId","data-v-ad681330"]]);var lt=ut;const dt=[{path:"/app/login",name:"login",component:Pe},{path:"/app/home/:userId",name:"home",component:ke,params:{userId:null},props:!0},{path:"/app/account/:id",component:qe,name:"account",params:{id:null},props:!0},{path:"/app/user",name:"user",component:Ye,query:{username:null,email:null}},{path:"/app/transaction/:id/:userId",component:lt,name:"transaction",params:{id:null,userId:null},query:{trxId:null},props:!0}],ht=(0,$.p7)({history:(0,$.PO)(),routes:dt});var mt=ht;const pt=(0,s.ri)(z);pt.use(mt).mount("#app")}},t={};function a(s){var n=t[s];if(void 0!==n)return n.exports;var r=t[s]={id:s,loaded:!1,exports:{}};return e[s].call(r.exports,r,r.exports,a),r.loaded=!0,r.exports}a.m=e,function(){var e=[];a.O=function(t,s,n,r){if(!s){var o=1/0;for(l=0;l<e.length;l++){s=e[l][0],n=e[l][1],r=e[l][2];for(var i=!0,c=0;c<s.length;c++)(!1&r||o>=r)&&Object.keys(a.O).every((function(e){return a.O[e](s[c])}))?s.splice(c--,1):(i=!1,r<o&&(o=r));if(i){e.splice(l--,1);var u=n();void 0!==u&&(t=u)}}return t}r=r||0;for(var l=e.length;l>0&&e[l-1][2]>r;l--)e[l]=e[l-1];e[l]=[s,n,r]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var s in t)a.o(t,s)&&!a.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){a.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){a.p="/app/"}(),function(){var e={143:0};a.O.j=function(t){return 0===e[t]};var t=function(t,s){var n,r,o=s[0],i=s[1],c=s[2],u=0;if(o.some((function(t){return 0!==e[t]}))){for(n in i)a.o(i,n)&&(a.m[n]=i[n]);if(c)var l=c(a)}for(t&&t(s);u<o.length;u++)r=o[u],a.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return a.O(l)},s=self["webpackChunkpayments_frontend"]=self["webpackChunkpayments_frontend"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=a.O(void 0,[998],(function(){return a(7136)}));s=a.O(s)})();
//# sourceMappingURL=app.6d861585.js.map