<template>
    <el-select v-model="selectedValue" value-key="id" :placeholder="placeholder" @change="handleChange">
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
            value: {
                type: [Array],
                default: function () {
                    return []
                }
            },
            url: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: '标签'
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
                if (this.url) {
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
