import { useEffect, useState } from 'react'
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const symbols = ['NPR', 'USD', 'EUR', 'SEK', 'DKK'];

const Symbol = ({ symbol, rates, conversions, setConversions }) => {


  const handleClick = (event) => {
    if (conversions.base !== symbol) {
      setConversions(conversions => ({
        ...conversions,
        base: symbol
      }))
    }
  }

  const handleFocus = (event) => event.target.select();

  const handleBlur = () => {
    setConversions(conversions => ({
      ...conversions,
      base: false
    }));
  }

  const format = (number) => {
    if (number) {
      let parts = parseFloat(number).toFixed(2).toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    } else return '0';
  }

  const handleChange = (event) => {
    const input = event.target.value;
    setConversions(conversions => ({
      ...conversions,
      [symbol]: input
    }));
    for (let i = 0; i < symbols.length; i++) {
      const base = symbol;
      const baseAmount = input;
      const target = symbols[i];
      const rate = rates[base][target];
      const targetAmount = baseAmount * rate;
      setConversions(conversions => ({
        ...conversions,
        [target]: targetAmount
      }));
    }
  }

  const handleKeyDown = (event) => {
    const thisIndex = symbols.indexOf(symbol);
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (thisIndex !== 0) ? thisIndex - 1 : symbols.length - 1;
        setConversions(conversions => ({
          ...conversions,
          base: symbols[prevIndex]
        }))
        break;
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (symbols.length - 1) !== thisIndex ? thisIndex + 1 : 0;
        setConversions(conversions => ({
          ...conversions,
          base: symbols[nextIndex]
        }))
        break;
      case 'Enter':
      case 'Escape':
        event.preventDefault();
        setConversions(conversions => ({
          ...conversions,
          base: false
        }))
        break;
      default:
    }
  }

  const handleClickPaste = (event) => {

    const paste = async () => {
      await navigator.clipboard.readText()
        .then(
          (clipText) => (
            setConversions(conversions => ({
              ...conversions,
              [symbol]: clipText,
              base: symbol
            }))
          )
        ).then(function() {
          console.log(conversions);
        })
    }
    paste();

    console.log('fooo')
  }

  const handleClickCopy = (event) => {
    event.stopPropagation();
    const copy = async () => {
      await navigator.clipboard.writeText(conversions[symbol])
        .then(
          () => (
            console.log('Copied: ' + conversions[symbol])
          )
        )
    }
    copy();
  }

  return (
    <div 
      onClick={handleClick}
      className={conversions.base === symbol ? 'selected' : ''}
    >
      <span className='icon paste' onClick={handleClickPaste}>
        <ContentPasteGoIcon />
      </span>
      <span className='amount'>
        {conversions.base === symbol ?
          <input 
            type='text'
            data-symbol={symbol} 
            defaultValue={conversions[symbol]} 
            autoFocus={true}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          /> : 
          <span>
            {(format(conversions[symbol])).split('.')[0]}
            {format(conversions[symbol]).split('.')[1] ? 
              <span>.{(format(conversions[symbol])).split('.')[1]}</span>
              : ''}
          </span>
        }
      </span>
      <span className='symbol'>{symbol}</span>
      <span className='icon copy' onClick={handleClickCopy}>
        <ContentCopyIcon />
      </span>
    </div>
  );

}

export default function Currencies() {

  const [rates, setRates] = useState({});
  const [conversions, setConversions] = useState({base: false});

  useEffect(() => {
    const fetchData = async base => {
      await fetch('https://api.exchangerate.host/latest?base=' + base + '&symbols=' + symbols.join(','))
        .then(response => response.json())
        .then(response => {
          setRates(rates => ({
            ...rates,
            [base]: response.rates
          }))
        });
    }
    for (let i = 0; i < symbols.length; i++) {
      fetchData(symbols[i]);
      setConversions(conversions => ({
        ...conversions,
        [symbols[i]]: 0
      }))
    }
  }, []);

  return (
    <div id="currencies" className='box'>
      {symbols.map((symbol) => (
        // <div>{symbol + ' = '+ JSON.stringify(rates[symbol])}</div>
        <Symbol 
          key={symbol} 
          symbol={symbol} 
          rates={rates} 
          conversions={conversions} 
          setConversions={setConversions}
        />
      ))}
    </div>
  );
}