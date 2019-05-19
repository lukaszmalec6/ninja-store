import {Injectable, Inject} from '@nestjs/common';
import {InjectableSymbols} from '../injectable';
import {Sequelize} from 'sequelize-typescript';
@Injectable()
export class DbService {
  constructor(@Inject(InjectableSymbols.db) private readonly db: Sequelize) {}

  public async seed() {
    await this.db.query(`
        INSERT INTO category(id, name, "createdAt", "updatedAt")
        VALUES 
                  ('2759b1ed-1aa4-4583-8b9f-8f446600cce1', 'weapons', now(), now()),
                  ('a7c08eb9-1ed6-4e59-8908-c021d67d5a45', 'accessories', now(), now()),
                  ('ca649aa5-f775-4a96-8ce1-51ca43dc5a79', 'clothes', now(), now());

        INSERT INTO "user"(id, "firstName", "lastName", email, password, status, role, "createdAt", "updatedAt")
        VALUES    ('0269ac24-4065-42a3-9b46-9c028742a38d', 'Jack', 'Sparrow', 'jack.sparrow@gmail.com', '992fc3201df13e79d105884c990ab9624cd24c9ad57260b8b7860248141ae0f5', 'active', 'admin', now(), now()),
                  ('191fd8db-2dfe-4850-ac5f-06ee6f7a9d5d', 'Jane', 'Doe', 'john.wick@gmail.com', '992fc3201df13e79d105884c990ab9624cd24c9ad57260b8b7860248141ae0f5', 'active', 'standard', now(), now()),
                  ('8ff7f1e1-a02b-4f19-9980-180cf83496de', 'John', 'Wick', 'jane.doe@gmail.com', '992fc3201df13e79d105884c990ab9624cd24c9ad57260b8b7860248141ae0f5', 'active', 'standard', now(), now());

        INSERT INTO product(id, name, "imageUrl", price, description, "categoryId", "createdAt", "updatedAt")
        VALUES    ('0679f426-c96a-490e-bef4-8320c7b31a83', 'katana', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '10.53', 'Lorem ipsum dolor sit amet', '2759b1ed-1aa4-4583-8b9f-8f446600cce1', now(), now()),
                  ('0c39eddf-57b4-4c99-8504-93308b7b1496', 'axe', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '12.53', 'Lorem ipsum dolor sit amet', '2759b1ed-1aa4-4583-8b9f-8f446600cce1', now(), now()),
                  ('11210740-d9e9-4b9d-9b30-fc4d83ba907a', 'sword', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '14.53', 'Lorem ipsum dolor sit amet', '2759b1ed-1aa4-4583-8b9f-8f446600cce1', now(), now()),
                  ('14a89f05-b4ce-4e1a-98f8-5667c617b7cc', 'flying knife', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '17.53', 'Lorem ipsum dolor sit amet', '2759b1ed-1aa4-4583-8b9f-8f446600cce1', now(), now()),
                  ('19324dc4-1456-4252-9814-e9ad33d685d2', 'shiruken', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', '2759b1ed-1aa4-4583-8b9f-8f446600cce1', now(), now()),

                  ('193d0af8-f8d3-4d88-ac6d-0ebbb89050d8', 'flashlight', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'a7c08eb9-1ed6-4e59-8908-c021d67d5a45', now(), now()),
                  ('31f8d140-17f4-440d-9989-429648e00e57', 'line', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'a7c08eb9-1ed6-4e59-8908-c021d67d5a45', now(), now()),
                  ('55666e8a-cada-4448-90e2-ab8da051dd0d', 'usb cable', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'a7c08eb9-1ed6-4e59-8908-c021d67d5a45', now(), now()),
                  ('5a813613-e7a2-4306-8edf-6b9dd7e94f39', 'blender', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'a7c08eb9-1ed6-4e59-8908-c021d67d5a45', now(), now()),
                  ('5c6643d3-6915-4255-947d-b80d00792f73', 'plastic bootle', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'a7c08eb9-1ed6-4e59-8908-c021d67d5a45', now(), now()),

                  ('69c33eb7-87b9-4f49-96ae-771792eccb99', 'white uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now()),
                  ('88816038-b3ee-4c60-9608-27bfe7a4f7f6', 'black uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now()),
                  ('9387ebe0-735b-48c9-be0c-816122099e71', 'red uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now()),
                  ('96cbd15b-1577-4318-a7f5-048dd84c2c0e', 'blue uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now()),
                  ('aea94b42-61af-49e5-bad1-cd62f31cdf6f', 'green uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now()),
                  ('b0f14303-3f2c-40df-b3a4-a7a7ee20d5b7', 'yellow uniform', 'https://images-na.ssl-images-amazon.com/images/I/61eJJ%2BPqfIL._SX425_.jpg', '18.53', 'Lorem ipsum dolor sit amet', 'ca649aa5-f775-4a96-8ce1-51ca43dc5a79', now(), now());  

        INSERT INTO "order"(id, "userId", "productId", "createdAt", "updatedAt")
        VALUES 
                  ('0f6af1e8-f511-416f-901c-10ba351810c9', '8ff7f1e1-a02b-4f19-9980-180cf83496de', '5c6643d3-6915-4255-947d-b80d00792f73',  now(), now()),
                  ('264283b0-152d-42f3-b793-6bc48a3885f4', '191fd8db-2dfe-4850-ac5f-06ee6f7a9d5d', '96cbd15b-1577-4318-a7f5-048dd84c2c0e',  now(), now()),
                  ('2953fc61-f096-44e1-8570-1c25845f18bd', '8ff7f1e1-a02b-4f19-9980-180cf83496de', '0679f426-c96a-490e-bef4-8320c7b31a83',  now(), now()),
                  ('30642406-027a-4e82-9c9e-155c4915a6a5', '191fd8db-2dfe-4850-ac5f-06ee6f7a9d5d', '0679f426-c96a-490e-bef4-8320c7b31a83',  now(), now()),
                  ('36681099-90e2-43ff-ad60-80c778e3d3eb', '8ff7f1e1-a02b-4f19-9980-180cf83496de', '0679f426-c96a-490e-bef4-8320c7b31a83',  now(), now());
    `, {
      type: this.db.QueryTypes.INSERT
    }
    )
  }
}
