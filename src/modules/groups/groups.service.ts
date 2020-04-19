import { Groups } from "./groups.model";
import { NotFound } from "../../common/exeptions";

class GroupsService {
  async findOneById(id) {
    const group = await Groups.findOne({ where: { id } });

    if (!group) {
      throw new NotFound("Group not found");
    }

    return group;
  }
}

export default new GroupsService();
