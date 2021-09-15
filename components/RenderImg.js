import Image from "next/image";

export default function RenderImg({ roleName }) {
  let imgSrc = "/mofashi.jpg";

  switch (roleName) {
    case "法师":
    case "魔导士":
    case "神导师":
      imgSrc = "/mofashi.jpg";
      break;
    case "剑士":
    case "骑士":
    case "神骑士":
      imgSrc = "/jianshi.jpg";
      break;
    case "弓箭手":
    case "圣射手":
    case "神射手":
      imgSrc = "/gongjianshou.jpg";
      break;
    case "召唤师":
    case "圣巫师":
    case "神巫师":
      imgSrc = "/zhaohuanshi.jpg";
      break;
    case "魔剑士":
    case "剑圣":
      imgSrc = "/mojianshi.jpg";
      break;
    case "圣导师":
    case "祭师":
      imgSrc = "/shendaoshi.jpg";
      break;
  }

  return <Image src={imgSrc} width={80} height={80} alt="icon" />;
}
