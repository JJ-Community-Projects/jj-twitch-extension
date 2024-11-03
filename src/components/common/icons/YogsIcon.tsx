import type {Component} from "solid-js";


export const YogsIcon: Component<{ size?: number }> = (props) => {

  const size = () => {
    const s = props.size ?? 18;
    return s + 'px';
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size()} height={size()} viewBox="0 0 1163 1268">
      <path
        id="Auswahl"
        fill="#ffffff"
        stroke="white"
        stroke-width="1"
        d="M 712.00,1.00
           C 719.54,2.41 1042.00,172.00 1042.00,172.00
             1042.00,172.00 806.56,637.00 806.56,637.00
             806.56,637.00 950.00,1176.00 950.00,1176.00
             950.00,1176.00 586.72,1265.88 586.72,1265.88
             586.72,1265.88 442.57,731.10 442.57,731.10
             442.57,731.10 0.00,496.00 0.00,496.00
             0.00,496.00 190.00,144.00 190.00,144.00
             190.00,144.00 545.00,365.00 545.00,365.00
             545.00,365.00 712.00,1.00 712.00,1.00 Z
           M 702.00,576.00"
      />
    </svg>
  )
}
