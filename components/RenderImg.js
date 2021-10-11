import Image from "next/image";

export default function RenderImg({ roleName }) {
  let img = "elf";
  const baseDir = "/header-images-1";
  const fileExt = ".png";

  switch (roleName) {
    case "法师":
    case "魔导士":
    case "神导师":
      img = "dw";
      break;
    case "剑士":
    case "骑士":
    case "神骑士":
      img = "dk";
      break;
    case "弓箭手":
    case "圣射手":
    case "神射手":
      img = "elf";
      break;
    case "召唤师":
    case "圣巫师":
    case "神巫师":
      img = "sum";
      break;
    case "魔剑士":
    case "剑圣":
      img = "mg";
      break;
    case "圣导师":
    case "祭师":
      img = "dl";
      break;
  }

  const fileName = `${baseDir}/${img}${fileExt}`;

  console.log(fileName)

  return <Image src={fileName} width={80} height={80} alt="icon" />;
}
