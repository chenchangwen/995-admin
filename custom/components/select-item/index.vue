<template>
    <el-select v-model="selectedValue" value-key="id" placeholder="请选择" @change="handleChange">
        <el-option v-if="items"
                   v-for="item in items"
                   :key="item.id"
                   :label="item[labelKey]"
                   :value="item[labelValue]">
        </el-option>

    </el-select>
</template>

<script>
    export default {
        name: 'selectItem',
        props: {
            value: {},
            options: {
                type: Object,
                default: {}
            },
            labelKey:{
                type :String,
                default: 'name'
            },
            valueKey:{
                type :String,
                default: 'value'
            }
        },
        data() {
            return {
                items: [],
                selectedValue: {}
            }
        },
        methods: {
            queryAPIUrl() {
                let that = this;
                let defaults = {
                    method: 'get'
                };
                let option = Object.assign({}, defaults, this.options);
                request(option).then(function (response) {
                    that.items = response.data;
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
        mounted() {
            this.queryAPIUrl();
        }
    }
</script>
