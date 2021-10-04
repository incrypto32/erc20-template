const usdPerBnb = 427;

const nOfTokens = 5000000;

const bnbSets = [10, 50, 100, 250];

bnbSets.forEach((e) => {
  const drtpPerBNB = nOfTokens / e;
  console.log(
    `${e} BNB in LP means for 250$ = ${(drtpPerBNB * 250) / 427}  500$ = ${(drtpPerBNB * 500) / 427}  750$ = ${
      (drtpPerBNB * 750) / 427
    }  1000$ = ${(drtpPerBNB * 1000) / 427}`
  );
});
