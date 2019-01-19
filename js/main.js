window.onload = function () {
    //DOM节点
    var month = document.getElementById('month');
    var error_month = document.getElementById('err_month');
    var salary = document.getElementById('salary');
    var salary_sum_label = document.getElementById('salary_sum');
    var food_cost = document.getElementById('food_cost');
    var food_sum_label = document.getElementById('food_cost_sum');
    var social_insurance = document.getElementById('social_insurance');
    var social_sum_label = document.getElementById('social_insurance_sum');
    var accumulate_fund = document.getElementById('accumulate_fund');
    var accumufund_sum_label = document.getElementById('accumulate_fund_sum');
    var tax_threshold = document.getElementById('tax_threshold');
    var tax_threshold_label = document.getElementById('tax_threshold_label');
    var special_dedution = document.getElementById('special_dedution');
    var special_dedution_label = document.getElementById('special_dedution_label');
    var clear_btn = document.getElementById('clear_btn');
    var compute_btn = document.getElementById('compute_btn');
    var confirm_label = document.getElementById('confirm_label');//非空验证
    var pre_tax_sum = document.getElementById('pre_tax_sum');//当前累计应纳税所得额
    var tax_rate = document.getElementById('tax_rate');//适用税率
    var quick_deduction = document.getElementById('quick_deduction');//速算减除数
    var cur_tax = document.getElementById('cur_tax');//本期应缴税额
    var last_tax = document.getElementById('last_tax');//上期已缴税额
    var real_tax = document.getElementById('real_tax');//实际应缴税额

    //事件绑定
    month.addEventListener('blur', isMonthTrue);
    month.addEventListener('keyup', isMonthTrue);
    salary.addEventListener('blur', function () { isTextAreaTrue(salary, salary_sum_label) });
    salary.addEventListener('keyup', function () { isTextAreaTrue(salary, salary_sum_label) });
    food_cost.addEventListener('blur', function () { isTextAreaTrue(food_cost, food_sum_label) });
    food_cost.addEventListener('keyup', function () { isTextAreaTrue(food_cost, food_sum_label) });
    social_insurance.addEventListener('blur', function () { isTextAreaTrue(social_insurance, social_sum_label) });
    social_insurance.addEventListener('keyup', function () { isTextAreaTrue(social_insurance, social_sum_label) });
    accumulate_fund.addEventListener('blur', function () { isTextAreaTrue(accumulate_fund, accumufund_sum_label) });
    accumulate_fund.addEventListener('keyup', function () { isTextAreaTrue(accumulate_fund, accumufund_sum_label) });
    tax_threshold.addEventListener('blur', function () { isInputFloat(tax_threshold, tax_threshold_label) });
    tax_threshold.addEventListener('keyup', function () { isInputFloat(tax_threshold, tax_threshold_label) });
    special_dedution.addEventListener('blur', function () { isInputFloat(special_dedution, special_dedution_label) });
    special_dedution.addEventListener('keyup', function () { isInputFloat(special_dedution, special_dedution_label) });
    clear_btn.addEventListener('click', clearInput);
    compute_btn.addEventListener('click', compute_tax);

    //计算本月应缴个税
    function compute_tax() {
        //非空验证未通过
        if (!isNotNull()) {
            clearResult();
            return;
        }
        var month_id = parseInt(month.value);
        var sal_sum = sumDirect(salary.value, false), food_sum = sumDirect(food_cost.value, false),
            soc_sum = sumDirect(social_insurance.value, false), acc_sum = sumDirect(accumulate_fund.value, false),
            taxthres_sum = tax_threshold.value * month_id, specdedu_sum = special_dedution.value * month_id;
        var last_sal_sum = sumDirect(salary.value, true), last_food_sum = sumDirect(food_cost.value, true),
            last_soc_sum = sumDirect(social_insurance.value, true), last_acc_sum = sumDirect(accumulate_fund.value, true),
            last_taxthres_sum = tax_threshold.value * (month_id - 1), last_specdedu_sum = special_dedution.value * (month_id - 1);
        var pre_tax_sum_val = sal_sum - food_sum - soc_sum - acc_sum - taxthres_sum - specdedu_sum;
        if (pre_tax_sum_val < 0) {
            confirm_label.innerHTML = '恭喜，您不用缴税';
            confirm_label.className = 'error_info';
            clearResult();
            return -1;
        }
        confirm_label.innerHTML = '';
        pre_tax_sum.innerHTML = pre_tax_sum_val.toFixed(3) + ' 元';//应缴税收入
        var taxInfo = computeTaxRate(pre_tax_sum_val);//税率及速算扣除
        tax_rate.innerHTML = taxInfo[0] * 100 + '%';
        quick_deduction.innerHTML = taxInfo[1].toFixed(3) + ' 元';
        var cur_tax_val = pre_tax_sum_val * taxInfo[0] - taxInfo[1];//本期应缴税额
        cur_tax.innerHTML = cur_tax_val.toFixed(3) + ' 元';
        /*计算上期相关参数*/
        var last_tax_sum_val = last_sal_sum - last_food_sum - last_soc_sum - last_acc_sum - last_taxthres_sum - last_specdedu_sum;
        var last_taxInfo = computeTaxRate(last_tax_sum_val);//税率及速算扣除
        var last_tax_val = last_tax_sum_val * last_taxInfo[0] - last_taxInfo[1];//上期应缴税额
        last_tax.innerHTML = last_tax_val.toFixed(3) + ' 元';
        var real_tax_val = cur_tax_val - last_tax_val;//本期实缴税额
        real_tax.innerHTML = real_tax_val.toFixed(3) + ' 元';
        return real_tax_val;
    }

    //清除右侧的个税结果数据
    function clearResult() {
        pre_tax_sum.innerHTML = '';
        tax_rate.innerHTML = '';
        quick_deduction.innerHTML = '';
        cur_tax.innerHTML = '';
        last_tax.innerHTML = '';
        real_tax.innerHTML = '';
    }

    //必须先填写月份栏
    month.focus();
    error_month.innerHTML = '';
    error_month.className = '';

    //月份数必须为整数
    function isMonthTrue() {
        confirm_label.innerHTML = '';
        var month_val = month.value;
        var tax_thres_val = tax_threshold.value;
        var special_dedution_val = special_dedution.value;
        if (!(/^\d+$/.test(month_val) && 0 < parseInt(month_val) && parseInt(month_val) < 13)) {
            error_month.className = 'error_info';
            error_month.innerHTML = '非法字符，月份数必须为1-12的整数';
            month.focus();
            month.className = 'error_input';
            tax_threshold_label.innerHTML = '';
            special_dedution_label.innerHTML = '';
        } else {
            error_month.innerHTML = '';
            error_month.className = '';
            month.className = '';
            tax_threshold_label.className = 'true_info';
            tax_threshold_label.innerHTML = '*' + month_val + ' = ' + month_val * tax_thres_val + ' 元';
            if (special_dedution_val) {
                special_dedution_label.className = 'true_info';
                special_dedution_label.innerHTML = '*' + month_val + ' = ' + month_val * special_dedution_val + ' 元';
            }
        }

    }

    //文本域数字累计计算
    function isTextAreaTrue(input_blank, info_label) {
        confirm_label.innerHTML = '';
        var sum_num = sum(trim(input_blank.value), input_blank, info_label);
        if (-1 !== sum_num) {
            input_blank.className = '';
            info_label.innerHTML = '累计：' + sum_num + ' 元';
            info_label.className = 'true_info';
        }
    }

    //判断表单输入是否是非负浮点数
    function isInputFloat(inBlank, infoLabel) {
        confirm_label.innerHTML = '';
        var val = inBlank.value;
        var month_val = month.value;
        if (isFloat(val)) {
            infoLabel.className = 'true_info';
            infoLabel.innerHTML = '*' + month_val + ' = ' + month_val * val + ' 元';
            // inBlank.blur();
            inBlank.className = '';
        } else {
            infoLabel.className = 'error_info';
            infoLabel.innerHTML = '非法字符，输入必须是非负实数';
            inBlank.focus();
            inBlank.className = 'error_input';
        }
    }

    //清空表单输入
    function clearInput() {
        //重新加载页面
        document.location.reload();
    }

    //非空验证
    function isNotNull() {
        var inputs = [salary, food_cost, social_insurance, accumulate_fund, tax_threshold, special_dedution];
        var month_id = parseInt(month.value);
        for (var i = 0, size = inputs.length; i < size; i++) {
            //存在空表单
            if (!inputs[i].value) {
                confirm_label.innerHTML = '存在空表单，请补全';
                confirm_label.className = 'error_info';
                return false;
            }
            //存在错误未处理
            if (inputs[i].className === 'error_input') {
                return false;
            }

            //参数个数不符
            if (trim(inputs[i].value).split(' ').length !== month_id && i < 4) {
                inputs[i].focus();
                inputs[i].className = 'error_input';
                confirm_label.innerHTML = '表单参数个数不符，请检查';
                confirm_label.className = 'error_info';
                return false;
            }
        }
        confirm_label.innerHTML = '';
        confirm_label.className = '';
        return true;
    }

    //计算适用税率及速算扣除数
    function computeTaxRate(income) {
        if (income < 0) return [0.0, 0.0];
        if (0 <= income && income <= 36000) return [0.03, 0.0];
        if (36000 < income && income <= 144000) return [0.1, 2520.0];
        if (144000 < income && income <= 300000) return [0.2, 16920.0];
        if (300000 < income && income <= 420000) return [0.25, 31920.0];
        if (420000 < income && income <= 660000) return [0.3, 52920.0];
        if (660000 < income && income <= 960000) return [0.35, 85920.0];
        if (income > 960000) return [0.45, 181920.0];
    }

    //用于累计计算
    function sumDirect(str, isLast) {
        var arr = trim(str).split(" ");
        var sum = 0.0;
        var size = arr.length;
        if (isLast) size = size - 1;
        for (var i = 0; i < size; i++) {
            sum += parseFloat(arr[i]);
        }
        return sum;
    }

    //切分字符串并求和
    function sum(str, info_Dom, err_label) {
        var arr = str.split(" ");
        var sum = 0.0;
        var month_val = parseInt(month.value), size = arr.length;
        if (size != month_val) {
            info_Dom.focus();
            info_Dom.className = 'error_input';
            err_label.innerHTML = '参数个数不符,参数个数必须与月份数一致';
            err_label.className = 'error_info';
            return -1.0;
        }
        for (var i = 0; i < size; i++) {
            if (!isFloat(arr[i])) {
                info_Dom.focus();
                info_Dom.className = 'error_input';
                err_label.innerHTML = '非法字符, 输入必须为非负实数';
                err_label.className = 'error_info';
                return -1.0;
            }
            sum += parseFloat(arr[i]);
        }
        return sum;
    }

    //测试字符串是否为非负浮点数
    function isFloat(str) {
        return /^0\.\d+$|^[0-9]+(\.\d+)?$/.test(str);
    }

    //去掉字符串前后的空格
    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }
}