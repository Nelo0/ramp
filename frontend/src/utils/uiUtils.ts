export function shortenCurrenyDisplay(amount: number, threshold: number, isFiat: boolean) {
    const formatter = new Intl.NumberFormat("en-IE", {minimumFractionDigits: 2});
    const amountStr = isFiat ? formatter.format(amount) : amount.toString();
    
    let amountDisplay = amountStr;
    if (amountStr.length > threshold) {
        if (isFiat) {
            amountDisplay = "~" + amountStr.split(".")[0];
        } else {
            amountDisplay = amountStr.slice(0, threshold-1);

            if (amountDisplay.endsWith(".")) amountDisplay += "..";
            else amountDisplay += "...";
        }
    }

    return amountDisplay;
}
