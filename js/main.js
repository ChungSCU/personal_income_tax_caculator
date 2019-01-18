window.onload = function () {
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

    //必须先填写月份栏
    month.focus();
    error_month.innerHTML = '';

    //月份数必须为整数
    function isMonthTrue() {
        month_val = month.value;
        if (!(/^\d+$/.test(month_val) && 0 < parseInt(month_val) && parseInt(month_val) < 13)) {
            error_month.className = 'error_info';
            error_month.innerHTML = '非法字符，月份数必须为1-12的整数';
            month.focus();
            month.className = 'error_input';
        } else {
            error_month.innerHTML = '';
            error_month.className = '';
            month.blur();
            month.className = '';
        }

    }

    //文本域数字累计计算
    function isTextAreaTrue(input_blank, info_label) {
        var sum_num = sum(trim(input_blank.value), input_blank, info_label);
        if (-1 !== sum_num) {
            // salary.blur();
            input_blank.className = '';
            info_label.innerHTML = '累计：' + sum_num + ' 元';
            info_label.className = 'true_info';
        }
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