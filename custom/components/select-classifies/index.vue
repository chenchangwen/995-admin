<template>
    <el-select v-model="selectedValue" multiple value-key="id" placeholder="请选择" @change="handleChange">
        <el-option v-if="items"
                   v-for="item in items"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>

    </el-select>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'select-classifies',
        props: {
            value: {
                type: Array,
                default: () => []
            },
            searchType: {
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
        computed: {
            ...mapGetters([
                'home',
            ])
        },
        methods: {
            queryAPIUrl() {
                let that = this;
                let option = {
                    method: 'get',
                    url: `/classifies/subjects?search=subject==${this.searchType};userId==${this.home.user.id}`,
                    params: {
                        page: 0,
                        size: 1000
                    }
                };
                let ids = [];
                if (that.value.length > 0) {
                    ids = that.value.map(function (item) {
                        return item.id;
                    });
                }
                request(option).then(function (response) {
                    that.items = response.data;
                    if (!_.isEmpty(that.items)) {
                        that.items = that.items[0].classifies;
                        if (!_.isEmpty(that.items)) {
                            that.items.map(function (item) {
                                if (ids.length > 0) {
                                    if (ids.indexOf(item.id) > -1) {
                                        that.selectedValue.push(item);
                                    }
                                }
                                return item;
                            });
                        }
                    }

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
