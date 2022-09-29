let x;
let y;
let r;

function checkX() {
    if (!validateRadio("X")) {
        showMessage("Значение X не выбрано")
        return false;
    }
    x = getRadio("X").eq(0).val();
    return true;
}

function checkY() {
    let yField = $('#y-text');
    let yVal = yField.val().replace(',', '.');

    if (yVal === "") {
        showMessage("Значение Y не введено")
        return false;
    } else if (yVal.match(/^[+-]0$/) || yVal.match(/^[+-]0\.0+$/) ||
        yVal.match(/^[+-]?00+$/) || yVal.match(/^[+-]?00+\.[0-9]+$/) ||
        !yVal.match(/^-?[0-9]+\.[0-9]+$/) && !yVal.match(/^-?[0-9]+$/)) {
        showMessage("Значение Y должно быть числом");
        return false;
    }

    if ((yVal <= -3 || yVal >= 3) && ((yVal.substring(0, 2) !== "2.") && (yVal.substring(0, 3) !== "-2.") && (yVal.substring(0, 2) !== "2,") && (yVal.substring(0, 3) !== "-2,"))) {
        showMessage("Значение Y не входит в интервал (-3,3)");
        return false;
    } else {
        if (yVal.substring(0, 1) === "-") {
            y = yVal.substring(0, 17);
        } else {
            y = yVal.substring(0, 16);
        }
        return true;
    }
}

function checkR() {
    if (!validateRadio("R")) {
        showMessage("Значение R не выбрано")
        return false;
    }
    r = getRadio("R").eq(0).val();
    return true;
}

function validateRadio(name) {
    return getRadio(name).length === 1;
}

function getRadio(name) {
    return $(`:input[name = "${name}"]:checked`);
}

function checkForm() {
    let xValid = checkX();
    let yValid = checkY();
    let rValid = checkR();
    return xValid && yValid && rValid;
}

function showMessage(message) {
    let errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    $('#errors').append(errorMessage);
}

function clearError() {
    $('#errors').empty();
}

$('#reset').click(function () {
    $('#errors').empty();
})

function clearTable() {
    let table = "<tr>\n" +
        "        <th>X</th>\n" +
        "        <th>Y</th>\n" +
        "        <th>R</th>\n" +
        "        <th>Текущее время</th>\n" +
        "        <th>Время работы скрипта</th>\n" +
        "        <th>Результат</th>\n" +
        "    </tr>"
    $('#result-table').html(table);
}

$('#main-form').on('submit', function (event) {
    event.preventDefault();
    clearError();
    if (checkForm()) {
        $.ajax({
            url: "php/main.php",
            type: 'POST',
            dataType: 'json',
            data: "X=" + x + "&Y=" + y + "&R=" + r,
            success: function (jsonData) {
                if (jsonData.error) {
                    clearError();
                    showMessage("Получены неверные данные");
                    return;
                }
                let row = '<tr>';
                row += '<td>' + jsonData.x + '</td>';
                row += '<td>' + jsonData.y + '</td>';
                row += '<td>' + jsonData.r + '</td>';
                row += '<td>' + jsonData.current + '</td>';
                row += '<td>' + jsonData.execution + '</td>';
                row += '<td>' + jsonData.result + '</td>';
                row += '</tr>';
                $('#result-table').append(row);
            },
        });
    }
})