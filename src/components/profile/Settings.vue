<template>
    <div class="settings container">
        <div v-if="profile" class="card">
            <h2 class="blue-text center">{{ profile.alias }}</h2>
        </div>
        <div class="field center">
            <button class="btn blue" @click.prevent="showModal('alias')">Change alias</button>
        </div>
        <div class="field center">
            <button class="btn blue" @click.prevent="showModal('email')">Change email</button>
        </div>
        <div class="field center">
            <button class="btn blue" @click.prevent="showModal('password')">Change password</button>
        </div>
        <div class="field center">
            <button class="btn red" @click.prevent="showModal('delete')">Delete account</button>
        </div>
        <Modal v-if="isModalVisible" :modalData="modalData" @close="closeModal" @change="changeData"/>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Modal from '@/components/profile/Modal'
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Settings',
    props: ['profile'],
    components: {
        Modal
    },
    data () {
        return {
            isModalVisible: false,
            modalData: {
                naslov: null,
                alias: null,
                email: null,
                password: null,
                delete: null,
                id: null
            }

        }
    },
    methods: {
        changeData(id, value) {
            let pass = prompt('Enter password:')
            console.log(value, id)
            if (id == 'alias') {
                db.collection('users').doc(this.$route.params.id).update({
                    alias: value
                })
            } else if (id == 'email') {
                let user = firebase.auth().currentUser
                let credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, pass
                )
                user.reauthenticateWithCredential(credential).then(() => {
                    user.updateEmail(value).then(() => {
                        console.log('Updated')
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(error => {
                    console.log(error)
                })
            } else if (id == 'password') {
                let user = firebase.auth().currentUser
                let credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, pass
                )
                user.reauthenticateWithCredential(credential).then(() => {
                    user.updatePassword(value).then(() => {
                        console.log('Updated')
                    }).catch(error => {
                        console.log(error)
                    })
                })
            } else if (id == 'delete') {
                let id = this.$route.params.id
                console.log(id)
                let user = firebase.auth().currentUser
                let credential = firebase.auth.EmailAuthProvider.credential(
                    user.email, pass
                )
                db.collection('users').doc(id).delete().then(() => {
                    console.log('Deleted')
                }).catch(error => {
                    console.log(error)
                })
                db.collection('pings').where('user_id',"==",user.uid).get()
                .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        db.collection('pings').doc(doc.id).delete()
                    })
                })

                user.reauthenticateWithCredential(credential).then(() => {
                    user.delete().then(() => {
                        console.log(id)
                    }).catch(error => {
                        console.log(error)
                    })
                }).catch(error => {
                    console.log(error)
                })
            }
            else {
                console.log('omgggg')
            }
            if (id != 'delete' && id != 'alias') this.$router.push({ name: 'Profile', params: {id: this.$route.params.id}})
            else if (id == 'delete') this.$router.push({name: 'Signup'})
            else {
                let user = firebase.auth().currentUser
                firebase.auth().signOut()
                this.reload(user.email, pass)
            }
        },
        reload(email, pass) {
            firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(cred => {
                    this.$router.push({ 
                        name: 'Map'
                    })
                }).catch(err => {
                    this.feedback = err.message
                })
        },
        showModal(id) {
            this.isModalVisible = true;
            this.setupModal(id)
        },
        closeModal() {
            this.isModalVisible = false;
        },
        setupModal(id) {
            if (id == 'alias') {
                this.modalData.naslov = 'Change alias'
                this.resetModal()
                this.id = id
                this.modalData.alias = true
            } else if (id == 'email') {
                this.modalData.naslov = 'Change email'
                this.resetModal()
                this.id = id
                this.modalData.email = true
            } else if (id == 'password') {
                this.modalData.naslov = 'Change password'
                this.resetModal()
                this.id = id
                this.modalData.password = true
            } else {
                this.modalData.naslov = 'Delete account'
                this.resetModal()
                this.id = id
                this.modalData.delete = true
            }
        },
        resetModal() {
            this.modalData.alias = null
            this.modalData.email = null
            this.modalData.password = null
            this.modalData.delete = null
            this.id = null
        }
    }
}
</script>

<style>
.settings {
    max-width: 400px;
    margin-top: 60px;
}

.settings h2 {
    font-size: 4.2em;
}

.settings .field {
    margin-bottom: 16px;
}

.settings .btn {
    width: 200px;
}
</style>