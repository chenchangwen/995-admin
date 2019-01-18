<template>
    <el-select v-model="selectedValue" value-key="id" multiple placeholder="角色" @change="handleChange"
               style="width: 100%">
        <el-option v-if="items"
                   v-for="item in items"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>

    </el-select>
</template>

<script>
    import authoritiesAPI from '../../api/authorities';

    export default {
        name: 'selectRole',
        props: {
            value: {
                type: [Array],
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                items: [],
                selectedValue: []
            }
        },
        methods: {
            queryAuthorities() {
                let that = this;
                let ids = [];
                if (that.value.length > 0) {
                    ids = that.value.map(function (item) {
                        return item.id;
                    });
                }
                authoritiesAPI.authorities().then(function (response) {
                    that.items = response.data;
                    that.items.map(function (item) {
                        if (ids.length > 0) {
                            if (item.id.indexOf(ids) > -1) {
                                that.selectedValue.push(item);
                            }
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
