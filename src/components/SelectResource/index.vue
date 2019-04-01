<template>
    <div class="select-more-box">
        <el-input placeholder="搜索名称" v-model="searchValue"></el-input>
        <div class="content">
            <span v-for="(item , index) in items" :key="item.id" :class="{'active':item.isActive}"
                  @click="handleClick(item)">
                {{item.name}}
            </span>
        </div>
    </div>
</template>

<script>
    import resourceAPI from '../../api/resource';

    export default {
        name: 'selectResource',
        props: {
            value: {
                type: [Array],
                default: function () {
                    return []
                }
            },
            isRefresh: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                searchValue: '',
                items: [],
                selectedValue: []
            }
        },
        methods: {
            queryResourcesAPI() {
                let that = this;
                let ids = [];
                if (that.value.length > 0) {
                    ids = that.value.map(function (item) {
                        return item.id;
                    });
                }
                resourceAPI.resources().then(function (response) {
                    that.items = response.data;
                    that.items.map(function (item) {
                        if (ids.length > 0) {
                            if (ids.indexOf(item.id) > -1) {
                                item.isActive = true;
                                that.selectedValue.push(item);
                            }
                        }
                        else {
                            item.isActive = false;
                        }
                        return item;
                    });
                })
            },

            handleClick(item) {
                item.isActive = !item.isActive;
                this.items = Object.assign([], this.items, item);
                let selectedValue = _.cloneDeep(this.items);
                selectedValue = selectedValue.filter(function (item) {
                    if (item.isActive) {
                        delete item.isActive;
                        return item;
                    }
                });
                this.$emit('update:value', selectedValue)
            }
        },
        watch: {
            value(newValue, oldValue) {
                this.selectedValue = newValue;

            }
        },
        mounted() {
            this.queryResourcesAPI();
        }
    }
</script>

<style lang="scss" scoped>
    .select-more-box {
        width: 100%;
        .content {
            height: 200px;
            scroll: auto;
            overflow-x: hidden;
            margin-top: 22px;
            span {
                cursor: pointer;
                margin-right: 10px;
                padding: 5px 10px;
                background: #fff;
                border: 1px solid #dcdfe6;
                color: #606266;
                border-radius: 4px;
                font-size: 12px;
                display: inline-block;
                line-height: 1;
                &.active {
                    color: #f56c6c;
                    background: #fef0f0;
                    border-color: #fbc4c4;
                }
            }
        }
    }
</style>
