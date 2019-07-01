<template>
    <div class="select-more-box">
        <input type="text" @keyup="handleKeyUp" v-model.trim="searchValue" placeholder="搜索名称">
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
        name: 'selectResourceOne',
        props: {
            value: {}
        },
        data() {
            return {
                searchValue: '',
                items: [],
                selectedValue: ''
            }
        },
        methods: {
            queryResourcesAPI() {
                let that = this;
                let ids = [];
                if (this.value) {
                    ids.push(this.value.id)
                }

                let options = this.searchValue ? {search: 'name==*' + this.searchValue+'*'} : '';
                resourceAPI.resources(options).then(function (response) {
                    that.items = response.data;
                    that.items.map(function (item) {
                        if (ids.length > 0) {
                            if (ids.indexOf(item.id) > -1) {
                                item.isActive = true;
                                that.selectedValue = item;
                            }
                        } else {
                            item.isActive = false;
                        }
                        return item;
                    });
                })
            },
            handleClick(item) {
                this.items.map(function(item){
                    item.isActive =false;
                    return item;
                });
                item.isActive = !item.isActive;
                this.items = Object.assign([], this.items, item);
                let cloneItem = _.cloneDeep(item);
                delete cloneItem.isActive;
                this.$emit('update:value', cloneItem)
            },
            handleKeyUp: _.debounce(function () {
                this.queryResourcesAPI();
            }, 200)
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
        input{
            padding: 5px 17px;
        }
        .content {
            height: 200px;
            scroll: auto;
            overflow-x: hidden;
            margin-top: 5px;

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
