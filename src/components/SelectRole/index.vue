<template>
    <el-select v-model="selectedValue" placeholder="角色" @change="handleChange">
        <el-option v-if="items"
                   v-for="item in items"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>

    </el-select>
</template>

<script>
    import authoritiesAPI from '../../api/authorities';

    export default {
        name: 'selectRole',
        props: {
            value: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                items: [],
                selectedValue: ''
            }
        },
        methods: {
            queryAuthorities() {
                let that = this;
                authoritiesAPI.authorities().then(function (response) {
                    that.items = response.data;
                    that.items.map(function (item) {
                        if (item.id === that.value) {
                            that.selectedValue = item.id;
                        }
                    });
                })
            },
            handleChange(value) {
                this.$emit('update:value', value)
            }
        },
        watch: {
            value(newValue, oldValue) {
                this.selectedValue = newValue;
            }
        },
        created() {
            this.queryAuthorities();
        }
    }
</script>
