import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { NestApplication } from "@nestjs/core";
import * as pactum from 'pactum';
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";
import { logDto, regDto } from "src/auth/dto";
import { editUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";

describe('App e2e',()=>{
  let app:NestApplication;
  let prisma:PrismaService

  beforeAll((async ()=>{
    const moduleRef = await Test.createTestingModule({
      imports:[AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      // accept only the values in dto
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);1
    await prisma.cleandb();
    pactum.request.setBaseUrl('http://localhost:3333');
  }));

  afterAll(()=>{app.close();});

  describe('Auth',()=>{
    const regdto: regDto = {
      email: 'email123@gmail.com',
      password: '123',
      fullName: 'name123',
    
    }
    describe('register',()=>{
      it('should throw error if email is empty',()=>{
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            password: regdto.password,
            fullName: regdto.fullName
          }).expectStatus(400).inspect();
      })
      it('should throw error if password is empty',()=>{
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email: regdto.email,
            fullName: regdto.fullName
          }).expectStatus(400).inspect();
      })
      it('should throw error if name is empty',()=>{
        return pactum.spec()
          .post('/auth/register')
          .withBody({
            email:regdto.email,
            password: regdto.password
          }).expectStatus(400).inspect();
      })
      it('should throw error if no body provided',()=>{
        return pactum.spec()
          .post('/auth/register')
          .expectStatus(400).inspect();
      })
      it('should register',()=>{
        return pactum.spec()
        .post('/auth/register')
        .withBody(regdto).expectStatus(HttpStatus.OK).inspect();
    });

    describe('login',()=>{
      const logdto: logDto = {
        email:'email123@gmail.com',
        password: '123',
      }
      it('should throw error if email is empty',()=>{
        return pactum.spec()
          .post('/auth/login')
          .withBody({
            password: regdto.password,
          }).expectStatus(400).inspect();
      })
      it('should throw error if password is empty',()=>{
        return pactum.spec()
          .post('/auth/login')
          .withBody({
            email: regdto.email,
          }).expectStatus(400).inspect();
      })
      it('should throw error if no body provided',()=>{
        return pactum.spec()
          .post('/auth/login')
          .expectStatus(400).inspect();
      })
      it('should login',()=>{
        return pactum.spec()
        .post('/auth/login')
        .withBody(logdto).expectStatus(HttpStatus.CREATED).stores('userAt','access_token');
      });
    });
  });
});
  describe('User',()=>{
    describe('Get me',()=>{
      it('should get current user',()=>{
        return pactum.spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).inspect();
      });
    
    });

    describe('Edit user',()=>{
      it('should edit user',()=>{
        const userdto : editUserDto = {
          email: 'admin@gmail.com',
          fullName:'admin123'
        }
        return pactum.spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).withBody(userdto).expectStatus(200).expectBodyContains(userdto.fullName).expectBodyContains(userdto.email).inspect();
      });
    });
  });

  describe('Bookmarks',()=>{
    describe('Get Empty bookmarks',()=>{
      it('should get bookmarks',()=>{
      return pactum.spec()
        .get('/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }).expectStatus(200).expectBody([]);
    })});

    describe('Create bookmark',()=>{
      const dto: CreateBookmarkDto = {
        title: 'Never Gonna Give You Up',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
      it('should create bookmarks',()=>{
        return pactum.spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).withBody(dto).expectStatus(201).stores('bookmarkId','id').inspect();
    })});

    describe('Get bookmarks',()=>{
      it('should get bookmarks',()=>{
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(200).expectJsonLength(1);
    })
    });

    describe('Get bookmarks by id',()=>{
      it('should get bookmarks by id',()=>{
        return pactum.spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(200).expectBodyContains('$S{bookmarkId}').inspect();
    })
    });

    describe('Edit bookmark by id',()=>{
      const dto: EditBookmarkDto = {
        title: 'Never Gonna Give You Up song',
        description: 'Never Gonna Give You Up description'}
        it('should edit bookmarks',()=>{
          return pactum.spec()
            .patch('/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}'
            }).withBody(dto).expectStatus(200)
            .expectBodyContains(dto.title).expectBodyContains(dto.description).inspect();
    })
  });

    describe('Delete bookmark by id',()=>{
      it('should delete bookmarks',()=>{
        return pactum.spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          }).expectStatus(204);
  })
  it('should get empty bookmarks',()=>{
    return pactum.spec()
      .get('/bookmarks')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}'
      }).expectStatus(200).expectJsonLength(0);
  })
    });
  });
});