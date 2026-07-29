import ImageKit from "@imagekit/nodejs";

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_2mNDT4uXH0r3WEDBoexLwT8NqdY=",
});

export default imageKit;
