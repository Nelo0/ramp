export function shortenCurrenyDisplay(amount: number, threshold: number, isFiat: boolean) {
    const amountStr = isFiat ? formatFiat(amount) : amount.toString();
    
    let amountDisplay = amountStr;
    if (amountStr.length > threshold) {
        if (isFiat) {
            const amountWhole = amountStr.split(".")[0];
            if (amountWhole.length > threshold) {
                const maxNumber = Number("9".repeat(threshold-2));
                const formattedMaxNumber = formatFiat(maxNumber);
                amountDisplay = ">" + formattedMaxNumber.split(".")[0];
            } else {
                amountDisplay = "~" + amountWhole;
            }
        } else {
            amountDisplay = amountStr.slice(0, threshold-1);

            if (amountDisplay.endsWith(".")) amountDisplay += "..";
            else amountDisplay += "...";
        }
    }

    return amountDisplay;
}

export function formatFiat(amount: number) {
    const formatter = new Intl.NumberFormat("en-IE", {minimumFractionDigits: 2});
    return formatter.format(amount);
}
