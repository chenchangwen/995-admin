<template>
    <div class="dashboard-container">
        <div class="dashboard-text">name:{{name}}</div>
        <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: 'dashboard',
        computed: {
            ...mapGetters([
                'name',
                'roles'
            ])
<<<<<<< HEAD
        },
        mounted() {
            // request({
            //     url: '/expo/audience/queryList',
            //     method: 'get',
            //     data: {username: '123123', password: '123123'}
            // }).then(function (res) {
            //     debugger;
            // })

=======
>>>>>>> d74f12175d37fc4ebee2044d9c1178ccfa4c80b1
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard {
        &-container {
            margin: 30px;
        }
        &-text {
            font-size: 30px;
            line-height: 46px;
        }
    }
</style>
