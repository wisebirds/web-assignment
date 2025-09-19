## web 과제

### 제출 조건

1. 과제 repo clone 후 개인 github 에 private repository 생성 후 Settings > Collaborators and teams > Manage access > Add People > dy128.kim@wisebirds.com, jinyeong.lee@wisebirds.com 계정을 추가해주세요
2. **제출 방법**: 과제 시작 시간부터 4시간 이내 필수로 push 해주세요.
   (시간이 부족할 경우 6시간 이내 추가로 push 할 수 있지만 추가 검토용으로만 참고될 예정입니다.)
3. 아래 구현 요구사항 외에는 제약 사항 없이 자유롭게 구현해주시면 됩니다.
4. **평가 기준**: 기능 구현 완성도, 최적화 및 설계 품질을 중점 검토 예정입니다.
   - 적용할 수 있는 모든 최적화 기능을 추가해주세요.
5. **유의 사항** :
   채용 과제 내용 및 진행 방식에 대한 일체의 정보 및 자료은 회사의 사전 서면 동의 없이 제3자에게 공개, 누설 또는 제공하는 것을 엄격히 금지하고 있습니다.

### 구현 내용

광고 Admin Dashboard 개발

**사전 과제 안내**

- 프레임워크, 라이브러리 사용은 제한이 없습니다.
- 현재 project 는 nextjs app router 로 구성되어 있으나 page router를 사용하셔도 되고 vite 를 사용하셔도 되는 등 제약은 없고 참고만 해주세요.

  ```
  turborepo(monorepo)

  nestads-web
      - apps
         - web (nextjs app router)
            - app
              - components
                  react-query-client-provider.tsx (react query 용 provider)
              -example/components
                  page.tsx (packages/ui/src/components 에 있는 shadcn component 예제)
            - utils
                api-client.ts

      - packages
        - ui
          - src/components (shadcn components)
  ```

- 화면 기획서를 보고 자유롭게 개발해주세요. (디자인 보다 기능 위주로 개발해주세요.)
- api는 apps/web/utils/api-client.ts 사용해주시면 됩니다.

**화면 기획서**

[[와이즈버즈 프론트엔드 채용 사전과제.pdf](https://github.com/user-attachments/files/22417555/default.pdf)


**Reference**

[shadcn doc](https://ui.shadcn.com/docs/components)

[nextjs doc](https://nextjs.org/docs)

[tailwind doc](https://tailwindcss.com/docs/padding)

[tanstack react query](https://tanstack.com/query/latest/docs/framework/react/overview)
