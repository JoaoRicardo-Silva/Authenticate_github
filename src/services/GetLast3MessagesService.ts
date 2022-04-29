import prismaClient from "../prisma/index";

class GetLast3MessagesService {
  async execute() {
    //SELECT * FROM MESSAGENS LIMIT 3 BY ORDER CREATED_AT DESC
    const messages = await prismaClient.message.findMany({
      take: 3,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: true,
      },
    });

    return messages;
  }
}

export { GetLast3MessagesService };
