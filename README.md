## web 과제

### 제출 조건

1. 과제 repo clone 후 개인 github 에 private repository 생성 후 Settings > Collaborators and teams > Manage access > Add People > dy128.kim@wisebirds.com 계정을 추가해주세요
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

- 화면 기획서를 보고 자유롭게 개발하세요. (디자인 보다 기능 위주로 개발해주세요.)
- api는 apps/web/utils/api-client.ts 참고하시면 됩니다.

**화면 기획서**

[화면 기획서 PDF 다운로드](https://file.notion.so/f/f/6982f344-4306-42b2-bb5f-3425240dffc1/4241eccd-cc80-41b3-a852-1676c5e6d211/%EC%99%80%EC%9D%B4%EC%A6%88%EB%B2%84%EC%A6%88_%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C_%EC%B1%84%EC%9A%A9_%EC%82%AC%EC%A0%84%EA%B3%BC%EC%A0%9C.pdf?table=block&id=fb9d888b-2433-4f8f-aa2c-1869a3a40200&spaceId=6982f344-4306-42b2-bb5f-3425240dffc1&expirationTimestamp=1758232800000&signature=fI61uWwD0bmIN9BgTrr1QyY9si0IAQku_MGpvr6gbV0&downloadName=%EC%99%80%EC%9D%B4%EC%A6%88%EB%B2%84%EC%A6%88+%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C+%EC%B1%84%EC%9A%A9+%EC%82%AC%EC%A0%84%EA%B3%BC%EC%A0%9C.pdf)

**Reference**

[shadcn doc](https://ui.shadcn.com/docs/components)

[nextjs doc](https://nextjs.org/docs)

[tailwind doc](https://tailwindcss.com/docs/padding)

[tanstack react query](https://tanstack.com/query/latest/docs/framework/react/overview)
