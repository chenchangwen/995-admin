<template>
    <el-select v-model="selectedValue" value-key="id" placeholder="标签" @change="handleChange">
        <el-option v-if="items"
                   v-for="item in items"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>

    </el-select>
</template>

<script>
    export default {
        name: 'selectItem',
        props: {
            valueOptions: {
                type: [Object],
                default: function () {
                    return {}
                }
            },
            value: {
                type: [Object, String],
                default: ''
            },
            url: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                items: [],
                selectedValue: {}
            }
        },
        methods: {
            setItems() {
                let that = this;
                let ids = [];
                if(this.url) {
                    if (that.value.length > 0) {
                        ids = that.value.map(function (item) {
                            return item.id;
                        });
                    }
                    let options = {
                        type: 'get',
                        url: this.url
                    };
                    request(options).then(function (response) {
                        that.items = response.data.models;
                        that.items.map(function (item) {
                            if (ids.length > 0) {
                                if (item.id.indexOf(ids) > -1) {
                                    that.selectedValue.push(item);
                                }
                            }
                        });
                    })
                }
                else{
                    if(!_.isEmpty(this.valueOptions)) {
                        that.items = this.valueOptions;
                        that.items.map(function (item) {
                            if (ids.length > 0) {
                                if (item.id.indexOf(ids) > -1) {
                                    that.selectedValue.push(item);
                                }
                            }
                        });
                    }
                }
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
            this.setItems();
        }
    }
</script>
