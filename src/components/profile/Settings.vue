<template>
    <div class="row" style="margin: 0 auto;">
        <div class="col-lg-4 col-sm-2 col-1"></div>
        <div class="card col-lg-4 col-sm-8 col-10 mt-4">
            <div class="card-body text-center">
                <h1 class="card-title">Settings</h1>
                <div class="btn-group-vertical">
                    <button class="btn btn-primary btn-lg mb-2" @click.prevent="showModal('alias')"
                    data-toggle="modal" data-target="#SettingsModal">Change alias</button>
                    <button class="btn btn-primary btn-lg mb-2" @click.prevent="showModal('email')"
                    data-toggle="modal" data-target="#SettingsModal">Change email</button>
                    <button class="btn btn-primary btn-lg mb-2" @click.prevent="showModal('password')"
                    data-toggle="modal" data-target="#SettingsModal">Change password</button>
                    <button class="btn btn-danger  btn-lg mb-2" @click.prevent="showModal('delete')"
                    data-toggle="modal" data-target="#SettingsModal">Delete account</button>
                </div>

                <Modal :modalData="modalData"/>
            </div>
        </div>
        <div class="col-lg-4 col-sm-2 col-1"></div>
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
        showModal(id) {
            this.isModalVisible = true;
            this.setupModal(id)
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
</style>